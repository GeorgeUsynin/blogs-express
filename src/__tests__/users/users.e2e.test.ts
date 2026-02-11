import { dbHelper, getAuthorization, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { CreateUserInputModel } from '../../features/users/api/models';

describe('users endpoints', () => {
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

    it('creates a user and returns it in get all users response', async () => {
        const newUser: CreateUserInputModel = {
            login: 'john_doe',
            password: 'secret12',
            email: 'john@example.com',
        };

        const { body: createdUser } = await request
            .post(ROUTES.USERS)
            .set(getAuthorization())
            .send(newUser)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(createdUser).toEqual({
            id: expect.any(String),
            login: newUser.login,
            email: newUser.email,
            createdAt: expect.any(String),
        });

        const { body: usersList } = await request
            .get(ROUTES.USERS)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(usersList).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdUser],
        });
    });

    it('deletes user by id', async () => {
        const newUser: CreateUserInputModel = {
            login: 'to_delete',
            password: 'secret12',
            email: 'delete@example.com',
        };

        const { body: createdUser } = await request
            .post(ROUTES.USERS)
            .set(getAuthorization())
            .send(newUser)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        await request
            .delete(`${ROUTES.USERS}/${createdUser.id}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: usersList } = await request
            .get(ROUTES.USERS)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(usersList).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
        });
    });

    it('returns 400 for invalid create user payload', async () => {
        const invalidUser = {
            login: 'ok_login',
            password: 'secret12',
            email: 'invalid-email',
        };

        const { body } = await request
            .post(ROUTES.USERS)
            .set(getAuthorization())
            .send(invalidUser)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect(body).toEqual({
            errorsMessages: expect.arrayContaining([
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'email',
                    message: expect.stringContaining('Email should match the specified'),
                },
            ]),
        });
    });

    it('returns 401 if authorization header is missing', async () => {
        const newUser: CreateUserInputModel = {
            login: 'no_auth',
            password: 'secret12',
            email: 'no-auth@example.com',
        };

        await request.post(ROUTES.USERS).send(newUser).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        await request.get(ROUTES.USERS).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        await request.delete(`${ROUTES.USERS}/507f1f77bcf86cd799439011`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
