import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { posts } from '../dataset';
import { mapToPostViewModel } from '../../features/posts/api/mappers';

describe('get post by id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ posts });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('returns post by requested id', async () => {
        const requestedId = (await dbHelper.getPost(2))._id;
        //requesting post by id
        const { body } = await request.get(`${ROUTES.POSTS}/${requestedId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual(mapToPostViewModel(posts[2]));
    });

    it('returns 404 status code if there is no requested post in database', async () => {
        const fakeRequestedId = '507f1f77bcf86cd799439011';
        //requesting post by id
        await request.get(`${ROUTES.POSTS}/${fakeRequestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
