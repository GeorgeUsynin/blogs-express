import { dbHelper, getAuthorization, loginAndGetToken, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { CreateUserInputModel } from '../../features/users/api/models';

describe('auth me endpoint', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterEach(async () => {
        await request.delete(ROUTES.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const createUser = async (payload: CreateUserInputModel) => {
        const { body } = await request
            .post(ROUTES.USERS)
            .set(getAuthorization())
            .send(payload)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        return body as { id: string; login: string; email: string; createdAt: string };
    };

    it('returns current user for a valid bearer token', async () => {
        const newUser: CreateUserInputModel = {
            login: 'me_user',
            password: 'secret12',
            email: 'me-user@example.com',
        };

        const createdUser = await createUser(newUser);
        const accessToken = await loginAndGetToken(newUser.login, newUser.password);

        const { body } = await request
            .get(`${ROUTES.AUTH}/me`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            userId: createdUser.id,
            login: createdUser.login,
            email: createdUser.email,
        });
    });

    it('returns 401 when authorization header is missing', async () => {
        await request.get(`${ROUTES.AUTH}/me`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 when bearer token is invalid', async () => {
        await request
            .get(`${ROUTES.AUTH}/me`)
            .set({ Authorization: 'Bearer invalid-token' })
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
