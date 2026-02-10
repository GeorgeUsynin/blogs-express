import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { blogs, posts } from '../dataset';
import { mapToBlogViewModel } from '../../features/blogs/api/mappers';
import { mapToPostViewModel } from '../../features/posts/api/mappers';

describe('/testing/all-data', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('deletes all data from database', async () => {
        //populating the database with blogs
        await dbHelper.setDb({ blogs, posts });

        // checking if all blogs are in the database
        await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200, [...blogs.map(mapToBlogViewModel)]);
        // checking if all posts are in the database
        await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200, [...posts.map(mapToPostViewModel)]);

        // deleting all data
        await request.delete(ROUTES.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });
});
