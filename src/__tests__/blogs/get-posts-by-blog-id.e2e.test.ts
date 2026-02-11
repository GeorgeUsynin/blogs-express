import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { blogs, posts } from '../dataset';
import { mapToPostViewModel } from '../../features/posts/api/mappers';

describe('get posts by blog id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs, posts });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs', 'posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('returns posts for requested blog id with pagination and sorting', async () => {
        const requestedId = blogs[1]._id.toString();

        const expectedItems = posts
            .filter(post => post.blogId === requestedId)
            .sort((a, b) => a.title.localeCompare(b.title))
            .slice(1, 2)
            .map(mapToPostViewModel);

        const { body } = await request
            .get(`${ROUTES.BLOGS}/${requestedId}/posts`)
            .query({ sortBy: 'title', sortDirection: 'asc', pageNumber: 2, pageSize: 1 })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 1,
            totalCount: 2,
            items: expectedItems,
        });
    });

    it('returns 400 for invalid blog id format', async () => {
        await request.get(`${ROUTES.BLOGS}/invalid-id/posts`).expect(HTTP_STATUS_CODES.BAD_REQUEST_400);
    });

    it('returns 400 for invalid query params', async () => {
        const requestedId = blogs[0]._id.toString();

        const { body } = await request
            .get(`${ROUTES.BLOGS}/${requestedId}/posts`)
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

    it('returns 404 if blog does not exist', async () => {
        await request.get(`${ROUTES.BLOGS}/507f1f77bcf86cd799439011/posts`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
