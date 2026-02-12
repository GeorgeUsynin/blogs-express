import { ObjectId, type WithId } from 'mongodb';
import { dbHelper, getAuthorization, loginAndGetToken, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import type { CreateUserInputModel } from '../../features/users/api/models';
import type { TComment } from '../../features/comments/domain';
import { comments as datasetComments } from '../dataset';

describe('comments by id endpoints', () => {
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
            createdAt: new Date().toISOString(),
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
            createdAt: new Date().toISOString(),
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
            createdAt: new Date().toISOString(),
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
            createdAt: new Date().toISOString(),
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
            createdAt: new Date().toISOString(),
        });

        await request
            .delete(`${ROUTES.COMMENTS}/${commentId}`)
            .set({ Authorization: `Bearer ${intruderToken}` })
            .expect(HTTP_STATUS_CODES.FORBIDDEN_403);
    });
});
