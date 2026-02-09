import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../features/shared/constants';
import { mapToBlogViewModel } from '../../features/blogs/api/mappers';
import { blogs } from '../dataset';

describe('get blog by id', () => {
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

    it('returns blog by requested id', async () => {
        const requestedId = (await dbHelper.getBlog(1))._id;
        //requesting blog by id
        const { body } = await request.get(`${ROUTES.BLOGS}/${requestedId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual(mapToBlogViewModel(blogs[1]));
    });

    it('returns 404 status code if there is no requested blog in database', async () => {
        const fakeRequestedId = '507f1f77bcf86cd799439011';
        //requesting blog by id
        await request.get(`${ROUTES.BLOGS}/${fakeRequestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
