import { dbHelper, request, getAuthorization } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { blogs } from '../dataset';

describe('delete blog by id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('deletes blog from database by providing ID', async () => {
        const requestedId = (await dbHelper.getBlog(1))._id;

        await request
            .delete(`${ROUTES.BLOGS}/${requestedId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the blog was deleted
        await request.get(`${ROUTES.BLOGS}/${requestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        const { body } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);
        expect(body.totalCount).toBe(3);
        expect(body.items).toHaveLength(3);
    });

    it('returns 404 status code if the blog was not founded by requested ID', async () => {
        const fakeRequestedId = '507f1f77bcf86cd799439011';

        await request
            .delete(`${ROUTES.BLOGS}/${fakeRequestedId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const requestedId = (await dbHelper.getBlog(1))._id;

        await request.delete(`${ROUTES.BLOGS}/${requestedId}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
