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
        await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200, []);

        // populating database with posts
        await dbHelper.setDb({ posts });

        // checking if all posts are in the database
        await request
            .get(ROUTES.POSTS)
            .expect(HTTP_STATUS_CODES.OK_200, [...posts.map(mapToPostViewModel)]);
    });
});
