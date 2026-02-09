import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../features/shared/constants';
import { blogs } from '../dataset';
import { mapToBlogViewModel } from '../../features/blogs/api/mappers';

describe('get all blogs', () => {
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

    it('gets all available blogs', async () => {
        // checking if all blogs are in the database
        await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200, [...blogs.map(mapToBlogViewModel)]);
    });
});
