import { request, getAuthorization } from '../test-helpers';
import { setDB } from '../../db';
import { HTTP_STATUS_CODES, ROUTES } from '../../features/shared/constants';
import { dataset } from '../dataset';

describe('delete blog by id', () => {
    it('deletes blog from database by providing ID', async () => {
        //populating database
        setDB({ blogs: dataset.blogs, posts: [] });

        const requestedId = '2';

        await request
            .delete(`${ROUTES.BLOGS}/${requestedId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the blog was deleted
        await request.get(`${ROUTES.BLOGS}/${requestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        const { body } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);
        expect(body.length).toBe(3);
    });

    it('returns 404 status code if the blog was not founded by requested ID', async () => {
        //populating database
        setDB({ blogs: dataset.blogs, posts: [] });

        const fakeRequestedId = '999';

        await request
            .delete(`${ROUTES.BLOGS}/${fakeRequestedId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('return 401 Unauthorized status code if there is no proper Authorization header', async () => {
        //populating database
        setDB({ blogs: dataset.blogs, posts: [] });

        const requestedId = '2';

        await request.delete(`${ROUTES.BLOGS}/${requestedId}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
