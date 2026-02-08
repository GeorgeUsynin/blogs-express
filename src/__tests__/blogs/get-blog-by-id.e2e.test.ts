import { request } from '../test-helpers';
import { setDB } from '../../db';
import { HTTP_STATUS_CODES, ROUTES } from '../../features/shared/constants';
import { dataset } from '../dataset';

describe('get blog by id', () => {
    it('returns blog by requested id', async () => {
        //populating database
        setDB({ blogs: dataset.blogs, posts: [] });

        const requestedId = '2';
        //requesting blog by id
        const { body } = await request.get(`${ROUTES.BLOGS}/${requestedId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual(dataset.blogs[1]);
    });

    it('returns 404 status code if there is no requested blog in database', async () => {
        //populating database
        setDB({ blogs: dataset.blogs, posts: [] });

        const fakeRequestedId = '999';
        //requesting blog by id
        await request.get(`${ROUTES.BLOGS}/${fakeRequestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
