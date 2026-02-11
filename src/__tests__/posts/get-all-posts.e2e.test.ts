import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { posts } from '../dataset';
import { mapToPostViewModel } from '../../features/posts/api/mappers';

describe('get all posts', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.resetCollections(['posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('gets all available posts', async () => {
        // checking that there are no posts in the database
        const { body: emptyPostsBody } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);
        expect(emptyPostsBody).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
        });

        // populating database with posts
        await dbHelper.setDb({ posts });

        // checking if all posts are in the database
        const { body } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);
        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: posts.length,
            items: expect.arrayContaining(posts.map(mapToPostViewModel)),
        });
        expect(body.items).toHaveLength(posts.length);
    });

    it('returns paginated and sorted posts for query params', async () => {
        await dbHelper.setDb({ posts });

        const expectedItems = [...posts]
            .sort((a, b) => a.title.localeCompare(b.title))
            .slice(3, 6)
            .map(mapToPostViewModel);

        const { body } = await request
            .get(ROUTES.POSTS)
            .query({ sortBy: 'title', sortDirection: 'asc', pageNumber: 2, pageSize: 3 })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            pagesCount: 3,
            page: 2,
            pageSize: 3,
            totalCount: posts.length,
            items: expectedItems,
        });
    });

    it('sorts posts by blogName in descending order', async () => {
        await dbHelper.setDb({ posts });

        const expectedItems = [...posts].sort((a, b) => b.blogName.localeCompare(a.blogName)).map(mapToPostViewModel);

        const { body } = await request
            .get(ROUTES.POSTS)
            .query({ sortBy: 'blogName', sortDirection: 'desc' })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: posts.length,
            items: expectedItems,
        });
    });

    it('returns 400 for invalid query params', async () => {
        const { body } = await request
            .get(ROUTES.POSTS)
            .query({ pageSize: 0, sortBy: 'invalid' })
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
});
