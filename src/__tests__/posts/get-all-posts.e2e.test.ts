import { request } from '../test-helpers';
import { setDB } from '../../db';
import { HTTP_STATUS_CODES, ROUTES } from '../../features/shared/constants';
import { dataset } from '../dataset';

describe('get all posts', () => {
    beforeEach(() => {
        setDB();
    });

    it('gets all available posts', async () => {
        // checking that there are no posts in the database
        await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200, []);

        //populating the database with 3 posts
        setDB({ blogs: [], posts: dataset.posts });

        // checking if all posts are in the database
        await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200, [...dataset.posts]);
    });
});
