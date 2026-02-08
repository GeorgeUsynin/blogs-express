import { request, getAuthorization } from '../test-helpers';
import { setDB } from '../../db';
import { HTTP_STATUS_CODES, ROUTES } from '../../features/shared/constants';
import { dataset } from '../dataset';

describe('delete post by id', () => {
    it('deletes post from database by providing ID', async () => {
        //populating database
        setDB({ blogs: [], posts: dataset.posts });

        const requestedId = '103';

        await request
            .delete(`${ROUTES.POSTS}/${requestedId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the post was deleted
        await request.get(`${ROUTES.POSTS}/${requestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        const { body } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);
        expect(body.length).toBe(7);
    });

    it('returns 404 status code if the post was not founded by requested ID', async () => {
        //populating database
        setDB({ blogs: [], posts: dataset.posts });

        const fakeRequestedId = '999';

        await request
            .delete(`${ROUTES.POSTS}/${fakeRequestedId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('return 401 Unauthorized status code if there is no proper Authorization header', async () => {
        //populating database
        setDB({ blogs: [], posts: dataset.posts });

        const requestedId = '103';

        await request.delete(`${ROUTES.POSTS}/${requestedId}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
