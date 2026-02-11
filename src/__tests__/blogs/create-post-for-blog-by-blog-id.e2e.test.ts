import { dbHelper, request, createErrorMessages, getAuthorization } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { blogs } from '../dataset';
import { CreateUpdatePostInputModel } from '../../features/posts/api/models';

describe('create post for blog by blog id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs', 'posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('creates a new post for requested blog id', async () => {
        const requestedId = blogs[1]._id.toString();
        const payload: Omit<CreateUpdatePostInputModel, 'blogId'> = {
            title: 'New title',
            shortDescription: 'New short description',
            content: 'New content',
        };

        const { body: createdPost } = await request
            .post(`${ROUTES.BLOGS}/${requestedId}/posts`)
            .set(getAuthorization())
            .send(payload)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(createdPost).toEqual({
            id: expect.any(String),
            ...payload,
            blogId: requestedId,
            blogName: blogs[1].name,
            createdAt: expect.any(String),
        });

        const { body: postsForBlog } = await request
            .get(`${ROUTES.BLOGS}/${requestedId}/posts`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(postsForBlog).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdPost],
        });
    });

    it('returns 400 status code and proper error object if `title` is missing', async () => {
        const requestedId = blogs[1]._id.toString();
        //@ts-expect-error bad request (title is missing)
        const payload: Omit<CreateUpdatePostInputModel, 'blogId'> = {
            shortDescription: 'New short description',
            content: 'New content',
        };

        const { body } = await request
            .post(`${ROUTES.BLOGS}/${requestedId}/posts`)
            .set(getAuthorization())
            .send(payload)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect(body).toEqual(createErrorMessages({ title: ['isRequired'] }));
    });

    it('returns 400 for invalid blog id format', async () => {
        const payload: Omit<CreateUpdatePostInputModel, 'blogId'> = {
            title: 'New title',
            shortDescription: 'New short description',
            content: 'New content',
        };

        await request
            .post(`${ROUTES.BLOGS}/invalid-id/posts`)
            .set(getAuthorization())
            .send(payload)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const requestedId = blogs[1]._id.toString();
        const payload: Omit<CreateUpdatePostInputModel, 'blogId'> = {
            title: 'New title',
            shortDescription: 'New short description',
            content: 'New content',
        };

        await request.post(`${ROUTES.BLOGS}/${requestedId}/posts`).send(payload).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 404 if blog does not exist', async () => {
        const payload: Omit<CreateUpdatePostInputModel, 'blogId'> = {
            title: 'New title',
            shortDescription: 'New short description',
            content: 'New content',
        };

        const { body } = await request
            .post(`${ROUTES.BLOGS}/507f1f77bcf86cd799439011/posts`)
            .set(getAuthorization())
            .send(payload)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        expect(body).toEqual(createErrorMessages({ blogId: ['blogIdNotExist'] }));
    });
});
