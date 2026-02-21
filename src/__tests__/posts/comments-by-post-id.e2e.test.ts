import { dbHelper, getAuthorization, loginAndGetToken, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { comments, posts } from '../dataset';
import type { CreateUserInputModel } from '../../features/users/api/models';

describe('comments by post id endpoints', () => {
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
        const user = await createUser({
            login: `u_${userSequence}`,
            password: 'secret12',
            email: `u_${userSequence}@mail.com`,
        });

        const token = await loginAndGetToken(user.login, 'secret12');

        return { user, token };
    };

    it('gets all comments for requested post id', async () => {
        await dbHelper.setDb({ posts, comments });

        const requestedPostId = posts[2]._id.toString();
        const expectedComments = comments.filter(comment => comment.postId === requestedPostId);

        const { body } = await request
            .get(`${ROUTES.POSTS}/${requestedPostId}/comments`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: expectedComments.length,
            items: expect.arrayContaining(
                expectedComments.map(comment => ({
                    id: comment._id.toString(),
                    content: comment.content,
                    commentatorInfo: {
                        userId: comment.commentatorInfo.userId,
                        userLogin: comment.commentatorInfo.userLogin,
                    },
                    likesInfo: {
                        dislikesCount: 0,
                        likesCount: 0,
                        myStatus: 'None',
                    },
                    createdAt: comment.createdAt,
                }))
            ),
        });
        expect(body.items).toHaveLength(expectedComments.length);
    });

    it('returns paginated comments for requested post id', async () => {
        await dbHelper.setDb({ posts, comments });

        const requestedPostId = posts[4]._id.toString();

        const { body } = await request
            .get(`${ROUTES.POSTS}/${requestedPostId}/comments`)
            .query({ pageNumber: 2, pageSize: 1, sortBy: 'createdAt', sortDirection: 'asc' })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body.pagesCount).toBe(2);
        expect(body.page).toBe(2);
        expect(body.pageSize).toBe(1);
        expect(body.totalCount).toBe(2);
        expect(body.items).toHaveLength(1);
    });

    it('returns 400 for invalid post id format when getting comments', async () => {
        await request.get(`${ROUTES.POSTS}/invalid-id/comments`).expect(HTTP_STATUS_CODES.BAD_REQUEST_400);
    });

    it('returns 400 for invalid query params when getting comments', async () => {
        await dbHelper.setDb({ posts, comments });
        const requestedPostId = posts[0]._id.toString();

        const { body } = await request
            .get(`${ROUTES.POSTS}/${requestedPostId}/comments`)
            .query({ sortBy: 'invalid', pageSize: 0 })
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect(body).toEqual({
            errorsMessages: expect.arrayContaining([
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'sortBy',
                    message: expect.stringContaining('SortBy field should be equal one of the following values'),
                },
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'pageSize',
                    message: 'PageSize field should be a positive number',
                },
            ]),
        });
    });

    it('returns 404 if post does not exist when getting comments', async () => {
        await request.get(`${ROUTES.POSTS}/507f1f77bcf86cd799439011/comments`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('creates comment for requested post id', async () => {
        await dbHelper.setDb({ posts });
        const { user, token } = await createUserAndGetToken();
        const requestedPostId = posts[1]._id.toString();
        const payload = {
            content: 'This comment is created through post comments endpoint successfully.',
        };

        const { body } = await request
            .post(`${ROUTES.POSTS}/${requestedPostId}/comments`)
            .set({ Authorization: `Bearer ${token}` })
            .send(payload)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(body).toEqual({
            id: expect.any(String),
            content: payload.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: 'None',
            },
            createdAt: expect.any(String),
        });

        await request
            .get(`${ROUTES.COMMENTS}/${body.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(HTTP_STATUS_CODES.OK_200);
    });

    it('returns 401 when creating comment without auth', async () => {
        await dbHelper.setDb({ posts });
        const requestedPostId = posts[0]._id.toString();

        await request
            .post(`${ROUTES.POSTS}/${requestedPostId}/comments`)
            .send({ content: 'This request should fail because there is no auth token.' })
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 400 when creating comment with invalid payload', async () => {
        await dbHelper.setDb({ posts });
        const { token } = await createUserAndGetToken();
        const requestedPostId = posts[3]._id.toString();

        const { body } = await request
            .post(`${ROUTES.POSTS}/${requestedPostId}/comments`)
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

    it('returns 400 when creating comment with invalid post id format', async () => {
        const { token } = await createUserAndGetToken();

        await request
            .post(`${ROUTES.POSTS}/invalid-id/comments`)
            .set({ Authorization: `Bearer ${token}` })
            .send({ content: 'This request has valid content but invalid post id format.' })
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);
    });

    it('returns 404 when creating comment for non-existent post', async () => {
        const { token } = await createUserAndGetToken();

        await request
            .post(`${ROUTES.POSTS}/507f1f77bcf86cd799439011/comments`)
            .set({ Authorization: `Bearer ${token}` })
            .send({ content: 'This request has valid content but the post does not exist.' })
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
