import { dbHelper, getAuthorization, loginAndGetToken, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { posts as datasetPosts } from '../dataset';
import type { CreateUserInputModel } from '../../features/users/api/models';

describe('post like status by id endpoint', () => {
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
        const login = `pl_${userSequence}`;
        const user = await createUser({
            login,
            password: 'secret12',
            email: `${login}@example.com`,
        });
        const token = await loginAndGetToken(user.login, 'secret12');

        return { user, token };
    };

    it('creates and updates like status for post by id', async () => {
        await dbHelper.setDb({ posts: datasetPosts });
        const liker = await createUserAndGetToken();
        const anotherUser = await createUserAndGetToken();
        const postId = datasetPosts[0]._id.toString();

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const likerViewAfterLike = await request
            .get(`${ROUTES.POSTS}/${postId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(likerViewAfterLike.body.extendedLikesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
            newestLikes: [
                {
                    addedAt: expect.any(String),
                    userId: liker.user.id,
                    login: liker.user.login,
                },
            ],
        });

        const anotherUserViewAfterLike = await request
            .get(`${ROUTES.POSTS}/${postId}`)
            .set({ Authorization: `Bearer ${anotherUser.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(anotherUserViewAfterLike.body.extendedLikesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [
                {
                    addedAt: expect.any(String),
                    userId: liker.user.id,
                    login: liker.user.login,
                },
            ],
        });

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Dislike' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const likerViewAfterDislike = await request
            .get(`${ROUTES.POSTS}/${postId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(likerViewAfterDislike.body.extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 1,
            myStatus: 'Dislike',
            newestLikes: [],
        });

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'None' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const likerViewAfterReset = await request
            .get(`${ROUTES.POSTS}/${postId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(likerViewAfterReset.body.extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
        });
    });

    it('returns 401 when updating like status without auth', async () => {
        await dbHelper.setDb({ posts: datasetPosts });
        const postId = datasetPosts[0]._id.toString();

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 400 when updating like status with invalid payload', async () => {
        await dbHelper.setDb({ posts: datasetPosts });
        const liker = await createUserAndGetToken();
        const postId = datasetPosts[0]._id.toString();

        const { body } = await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
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

    it('returns 404 when updating like status for non-existent post', async () => {
        const liker = await createUserAndGetToken();

        await request
            .put(`${ROUTES.POSTS}/507f1f77bcf86cd799439011/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('returns 400 when updating like status with invalid post id format', async () => {
        const liker = await createUserAndGetToken();

        await request
            .put(`${ROUTES.POSTS}/invalid-id/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);
    });

    it('is idempotent when setting the same like status repeatedly', async () => {
        await dbHelper.setDb({ posts: datasetPosts });
        const liker = await createUserAndGetToken();
        const postId = datasetPosts[1]._id.toString();

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: afterFirstLike } = await request
            .get(`${ROUTES.POSTS}/${postId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(afterFirstLike.extendedLikesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
            newestLikes: [
                {
                    addedAt: expect.any(String),
                    userId: liker.user.id,
                    login: liker.user.login,
                },
            ],
        });

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: afterSecondLike } = await request
            .get(`${ROUTES.POSTS}/${postId}`)
            .set({ Authorization: `Bearer ${liker.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(afterSecondLike.extendedLikesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
            newestLikes: [
                {
                    addedAt: expect.any(String),
                    userId: liker.user.id,
                    login: liker.user.login,
                },
            ],
        });
    });

    it('returns only 3 newest likes when 4 users like the same post', async () => {
        await dbHelper.setDb({ posts: datasetPosts });
        const liker1 = await createUserAndGetToken();
        const liker2 = await createUserAndGetToken();
        const liker3 = await createUserAndGetToken();
        const liker4 = await createUserAndGetToken();
        const postId = datasetPosts[2]._id.toString();

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .set({ Authorization: `Bearer ${liker1.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .set({ Authorization: `Bearer ${liker2.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .set({ Authorization: `Bearer ${liker3.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        await request
            .put(`${ROUTES.POSTS}/${postId}/like-status`)
            .set({ Authorization: `Bearer ${liker4.token}` })
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body } = await request
            .get(`${ROUTES.POSTS}/${postId}`)
            .set({ Authorization: `Bearer ${liker4.token}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body.extendedLikesInfo.likesCount).toBe(4);
        expect(body.extendedLikesInfo.dislikesCount).toBe(0);
        expect(body.extendedLikesInfo.myStatus).toBe('Like');
        expect(body.extendedLikesInfo.newestLikes).toHaveLength(3);

        const newestLikeUserIds = body.extendedLikesInfo.newestLikes.map((like: { userId: string }) => like.userId);

        expect(newestLikeUserIds).toContain(liker2.user.id);
        expect(newestLikeUserIds).toContain(liker3.user.id);
        expect(newestLikeUserIds).toContain(liker4.user.id);
        expect(newestLikeUserIds).not.toContain(liker1.user.id);
    });
});
