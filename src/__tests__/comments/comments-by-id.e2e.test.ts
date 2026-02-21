import { ObjectId, type WithId } from 'mongodb';
import { dbHelper, getAuthorization, loginAndGetToken, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import type { CreateUserInputModel } from '../../features/users/api/models';
import type { TComment } from '../../features/comments/domain';
import { comments as datasetComments } from '../dataset';

describe('comments by id endpoints', () => {
    let userSequence = 0;

    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterEach(async () => {
        await request.delete(ROUTES.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const createUser = async (payload: CreateUserInputModel) => {
        const { body } = await request
            .post(ROUTES.USERS)
            .set(getAuthorization())
            .send(payload)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        return body as { id: string; login: string; email: string; createdAt: string };
    };

    const createUserAndGetToken = async () => {
        userSequence += 1;
        const login = `u_${userSequence}`;
        const user = await createUser({
            login,
            password: 'secret12',
            email: `${login}@example.com`,
        });
        const token = await loginAndGetToken(user.login, 'secret12');

        return { user, token };
    };

    const createComment = async (comment: Omit<TComment, 'postId'> & { postId?: string }): Promise<string> => {
        const commentDoc: WithId<TComment> = {
            _id: new ObjectId(),
            ...comment,
            postId: comment.postId ?? new ObjectId().toString(),
        };

        await dbHelper.setDb({ comments: [commentDoc] });

        return commentDoc._id.toString();
    };

    it('gets comment by id without auth', async () => {
        await dbHelper.setDb({ comments: datasetComments });
        const commentId = datasetComments[0]._id.toString();

        const { body } = await request.get(`${ROUTES.COMMENTS}/${commentId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            id: commentId,
            content: datasetComments[0].content,
            commentatorInfo: {
                userId: datasetComments[0].commentatorInfo.userId,
                userLogin: datasetComments[0].commentatorInfo.userLogin,
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: 'None',
            },
            createdAt: expect.any(String),
        });
    });

    it('returns 404 when comment is not found', async () => {
        await request.get(`${ROUTES.COMMENTS}/507f1f77bcf86cd799439011`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('updates own comment by id', async () => {
        const user = await createUser({
            login: 'c_upd_01',
            password: 'secret12',
            email: 'comment-update@example.com',
        });
        const token = await loginAndGetToken(user.login, 'secret12');

        const commentId = await createComment({
            content: 'This is the original comment content before update.',
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            createdAt: new Date().toISOString(),
            isDeleted: false,
        });

        const updatedContent = 'This comment has been updated by the owner successfully.';

        await request
            .put(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({ content: updatedContent })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body } = await request
            .get(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body.content).toBe(updatedContent);
    });

    it("returns 403 when updating someone else's comment", async () => {
        const owner = await createUser({
            login: 'c_owner1',
            password: 'secret12',
            email: 'comment-owner@example.com',
        });
        const intruder = await createUser({
            login: 'c_intr01',
            password: 'secret12',
            email: 'comment-intruder@example.com',
        });

        const intruderToken = await loginAndGetToken(intruder.login, 'secret12');

        const commentId = await createComment({
            content: 'This comment belongs to the owner and cannot be updated by others.',
            commentatorInfo: {
                userId: owner.id,
                userLogin: owner.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            createdAt: new Date().toISOString(),
            isDeleted: false,
        });

        await request
            .put(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${intruderToken}` })
            .send({ content: 'This should fail because user is not the owner.' })
            .expect(HTTP_STATUS_CODES.FORBIDDEN_403);
    });

    it('returns 400 when updating comment with invalid payload', async () => {
        const user = await createUser({
            login: 'c_bad_01',
            password: 'secret12',
            email: 'comment-bad-payload@example.com',
        });
        const token = await loginAndGetToken(user.login, 'secret12');

        const commentId = await createComment({
            content: 'This comment will be used to check update payload validation.',
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            createdAt: new Date().toISOString(),
            isDeleted: false,
        });

        const { body } = await request
            .put(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({ content: 'too short' })
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect(body).toEqual({
            errorsMessages: expect.arrayContaining([
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'content',
                    message: 'Content length should be from 20 to 300 characters',
                },
            ]),
        });
    });

    it('creates and updates like status for comment by id', async () => {
        const owner = await createUserAndGetToken();
        const liker = await createUserAndGetToken();

        const commentId = await createComment({
            content: 'Comment for like status updates and read model verification.',
            commentatorInfo: {
                userId: owner.user.id,
                userLogin: owner.user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            createdAt: new Date().toISOString(),
            isDeleted: false,
        });

        await request
            .put(`${ROUTES.COMMENTS}/${commentId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const likerViewAfterLike = await request
            .get(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(likerViewAfterLike.body.likesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
        });

        await request
            .put(`${ROUTES.COMMENTS}/${commentId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Dislike' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const likerViewAfterDislike = await request
            .get(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(likerViewAfterDislike.body.likesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 1,
            myStatus: 'Dislike',
        });

        const ownerViewAfterDislike = await request
            .get(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${owner.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(ownerViewAfterDislike.body.likesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 1,
            myStatus: 'None',
        });

        await request
            .put(`${ROUTES.COMMENTS}/${commentId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'None' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const likerViewAfterReset = await request
            .get(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(likerViewAfterReset.body.likesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
        });
    });

    it('returns 401 when updating like status without auth', async () => {
        const owner = await createUserAndGetToken();
        const commentId = await createComment({
            content: 'Comment for unauthorized like status endpoint verification.',
            commentatorInfo: {
                userId: owner.user.id,
                userLogin: owner.user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            createdAt: new Date().toISOString(),
            isDeleted: false,
        });

        await request
            .put(`${ROUTES.COMMENTS}/${commentId}/like-status`)
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 400 when updating like status with invalid payload', async () => {
        const owner = await createUserAndGetToken();
        const liker = await createUserAndGetToken();
        const commentId = await createComment({
            content: 'Comment for invalid like status payload validation checks.',
            commentatorInfo: {
                userId: owner.user.id,
                userLogin: owner.user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            createdAt: new Date().toISOString(),
            isDeleted: false,
        });

        const { body } = await request
            .put(`${ROUTES.COMMENTS}/${commentId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'invalid-status' })
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect(body).toEqual({
            errorsMessages: expect.arrayContaining([
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'likeStatus',
                    message: 'LikeStatus field should be equal one of the following values: None, Like, Dislike',
                },
            ]),
        });
    });

    it('returns 404 when updating like status for non-existent comment', async () => {
        const liker = await createUserAndGetToken();

        await request
            .put(`${ROUTES.COMMENTS}/507f1f77bcf86cd799439011/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('returns 400 when updating like status with invalid comment id format', async () => {
        const liker = await createUserAndGetToken();

        await request
            .put(`${ROUTES.COMMENTS}/invalid-id/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);
    });

    it('is idempotent when setting the same like status repeatedly', async () => {
        const owner = await createUserAndGetToken();
        const liker = await createUserAndGetToken();

        const commentId = await createComment({
            content: 'Comment for idempotent like status update checks in comments endpoint.',
            commentatorInfo: {
                userId: owner.user.id,
                userLogin: owner.user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            createdAt: new Date().toISOString(),
            isDeleted: false,
        });

        await request
            .put(`${ROUTES.COMMENTS}/${commentId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: afterFirstLike } = await request
            .get(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(afterFirstLike.likesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
        });

        await request
            .put(`${ROUTES.COMMENTS}/${commentId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: afterSecondLike } = await request
            .get(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(afterSecondLike.likesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
        });
    });

    it('deletes own comment by id', async () => {
        const user = await createUser({
            login: 'c_del_01',
            password: 'secret12',
            email: 'comment-delete@example.com',
        });
        const token = await loginAndGetToken(user.login, 'secret12');

        const commentId = await createComment({
            content: 'This comment will be removed by the owner through delete endpoint.',
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            createdAt: new Date().toISOString(),
            isDeleted: false,
        });

        await request
            .delete(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        await request
            .get(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it("returns 403 when deleting someone else's comment", async () => {
        const owner = await createUser({
            login: 'd_owner1',
            password: 'secret12',
            email: 'delete-owner@example.com',
        });
        const intruder = await createUser({
            login: 'd_intr01',
            password: 'secret12',
            email: 'delete-intruder@example.com',
        });

        const intruderToken = await loginAndGetToken(intruder.login, 'secret12');

        const commentId = await createComment({
            content: 'This comment belongs to owner and intruder should not delete it.',
            commentatorInfo: {
                userId: owner.id,
                userLogin: owner.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            createdAt: new Date().toISOString(),
            isDeleted: false,
        });

        await request
            .delete(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${intruderToken}` })
            .expect(HTTP_STATUS_CODES.FORBIDDEN_403);
    });
});
