import { request } from './test-helpers';
import { setDB } from '../db';
import { HTTP_STATUS_CODES, ROUTES } from '../features/shared/constants';
import { dataset } from './dataset';

describe('/testing/all-data', () => {
    beforeEach(() => {
        setDB();
    });

    it('deletes all data from database', async () => {
        //populating the database with blogs
        setDB(dataset);

        // checking if all blogs are in the database
        await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200, [...dataset.blogs]);
        // checking if all posts are in the database
        await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200, [...dataset.posts]);

        // deleting all data
        await request.delete(ROUTES.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });
});
