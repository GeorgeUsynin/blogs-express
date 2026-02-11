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
});
