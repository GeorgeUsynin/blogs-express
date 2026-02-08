import { request } from '../test-helpers';
import { setDB } from '../../db';
import { HTTP_STATUS_CODES, ROUTES } from '../../features/shared/constants';
import { dataset } from '../dataset';

describe('get all blogs', () => {
    beforeEach(() => {
        setDB();
    });

    it('gets all available blogs', async () => {
        // checking that there are no blogs in the database
        await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200, []);

        //populating the database with 3 blogs
        setDB({ blogs: dataset.blogs, posts: [] });

        // checking if all blogs are in the database
        await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200, [...dataset.blogs]);
    });
});
