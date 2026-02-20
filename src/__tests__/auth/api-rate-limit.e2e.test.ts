import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { dbHelper, request } from '../test-helpers';

describe('auth api rate limit', () => {
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

    const expectRateLimit = async (
        path: string,
        payload: Record<string, unknown>,
        expectedStatusBeforeLimit: HTTP_STATUS_CODES
    ) => {
        for (let i = 0; i < 5; i++) {
            await request.post(path).send(payload).expect(expectedStatusBeforeLimit);
        }

        const { body } = await request.post(path).send(payload).expect(HTTP_STATUS_CODES.TOO_MANY_REQUESTS_429);

        expect(body).toEqual({
            errorsMessages: [
                {
                    status: HTTP_STATUS_CODES.TOO_MANY_REQUESTS_429,
                    message: expect.stringContaining('Too many requests!'),
                    code: 'API_RATE_LIMIT',
                },
            ],
        });
    };

    it('returns 429 for POST /auth/login after 5 requests in 10 seconds', async () => {
        await expectRateLimit(`${ROUTES.AUTH}/login`, { loginOrEmail: '   ' }, HTTP_STATUS_CODES.BAD_REQUEST_400);
    });

    it('returns 429 for POST /auth/registration after 5 requests in 10 seconds', async () => {
        await expectRateLimit(`${ROUTES.AUTH}/registration`, { login: '  ' }, HTTP_STATUS_CODES.BAD_REQUEST_400);
    });

    it('returns 429 for POST /auth/registration-confirmation after 5 requests in 10 seconds', async () => {
        await expectRateLimit(
            `${ROUTES.AUTH}/registration-confirmation`,
            { code: 'invalid-code' },
            HTTP_STATUS_CODES.BAD_REQUEST_400
        );
    });

    it('returns 429 for POST /auth/registration-email-resending after 5 requests in 10 seconds', async () => {
        await expectRateLimit(
            `${ROUTES.AUTH}/registration-email-resending`,
            { email: 'missing-user@example.com' },
            HTTP_STATUS_CODES.NO_CONTENT_204
        );
    });

    it('returns 429 for POST /auth/password-recovery after 5 requests in 10 seconds', async () => {
        await expectRateLimit(`${ROUTES.AUTH}/password-recovery`, { email: '   ' }, HTTP_STATUS_CODES.BAD_REQUEST_400);
    });

    it('returns 429 for POST /auth/new-password after 5 requests in 10 seconds', async () => {
        await expectRateLimit(
            `${ROUTES.AUTH}/new-password`,
            { newPassword: '   ', recoveryCode: '   ' },
            HTTP_STATUS_CODES.BAD_REQUEST_400
        );
    });
});
