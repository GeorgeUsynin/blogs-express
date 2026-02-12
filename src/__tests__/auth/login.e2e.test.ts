import { dbHelper, getAuthorization, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { CreateUserInputModel } from '../../features/users/api/models';
import { CreateLoginInputModel } from '../../features/auth/api/models';

describe('auth login endpoint', () => {
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
        await request.post(ROUTES.USERS).set(getAuthorization()).send(payload).expect(HTTP_STATUS_CODES.CREATED_201);
    };

    it('logs in with login', async () => {
        const newUser: CreateUserInputModel = {
            login: 'john_auth',
            password: 'secret12',
            email: 'john-auth@example.com',
        };

        await createUser(newUser);

        const payload: CreateLoginInputModel = {
            loginOrEmail: newUser.login,
            password: newUser.password,
        };

        const { body } = await request
            .post(`${ROUTES.AUTH}/login`)
            .send(payload)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            accessToken: expect.any(String),
        });
    });

    it('logs in with email', async () => {
        const newUser: CreateUserInputModel = {
            login: 'mail_auth',
            password: 'secret12',
            email: 'mail-auth@example.com',
        };

        await createUser(newUser);

        const payload: CreateLoginInputModel = {
            loginOrEmail: newUser.email,
            password: newUser.password,
        };

        const { body } = await request
            .post(`${ROUTES.AUTH}/login`)
            .send(payload)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            accessToken: expect.any(String),
        });
    });

    it('returns 401 for invalid credentials', async () => {
        const newUser: CreateUserInputModel = {
            login: 'wrong_pass',
            password: 'secret12',
            email: 'wrong-pass@example.com',
        };

        await createUser(newUser);

        await request
            .post(`${ROUTES.AUTH}/login`)
            .send({ loginOrEmail: newUser.login, password: 'bad-pass' })
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 400 for invalid payload', async () => {
        const payload = {
            loginOrEmail: '   ',
        };

        const { body } = await request
            .post(`${ROUTES.AUTH}/login`)
            .send(payload)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect(body).toEqual({
            errorsMessages: expect.arrayContaining([
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'loginOrEmail',
                    message: 'LoginOrEmail field should not be empty or contain only spaces',
                },
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'password',
                    message: 'Password field is required',
                },
            ]),
        });
    });
});
