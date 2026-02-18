import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { CreateLoginInputModel, NewPasswordInputModel } from '../../features/auth/api/models';
import { CreateUserInputModel } from '../../features/users/api/models';
import { EmailAdapter } from '../../shared/adapters';
import { dbHelper, getAuthorization, request } from '../test-helpers';

describe('auth password recovery endpoints', () => {
    let sendEmailSpy: jest.SpyInstance;

    beforeAll(async () => {
        await dbHelper.connectToDb();
        sendEmailSpy = jest.spyOn(EmailAdapter.prototype, 'sendEmail').mockImplementation(() => {});
    });

    afterEach(async () => {
        await request.delete(ROUTES.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
        sendEmailSpy.mockClear();
    });

    afterAll(async () => {
        sendEmailSpy.mockRestore();
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const createConfirmedUser = async (payload: CreateUserInputModel) => {
        await request.post(ROUTES.USERS).set(getAuthorization()).send(payload).expect(HTTP_STATUS_CODES.CREATED_201);
    };

    const getLastRecoveryCode = (): string => {
        const lastCall = sendEmailSpy.mock.calls[sendEmailSpy.mock.calls.length - 1];
        const message = lastCall?.[2] as string | undefined;
        const recoveryCode = message?.match(/recoveryCode=([^']+)/)?.[1];

        expect(recoveryCode).toBeDefined();
        return recoveryCode!;
    };

    describe('POST /auth/password-recovery', () => {
        it('returns 204 and sends recovery email for existing user', async () => {
            const user: CreateUserInputModel = {
                login: 'recover1',
                password: 'secret12',
                email: 'recover-user@example.com',
            };
            await createConfirmedUser(user);

            await request
                .post(`${ROUTES.AUTH}/password-recovery`)
                .send({ email: user.email })
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            expect(sendEmailSpy).toHaveBeenCalledTimes(1);
            expect(sendEmailSpy).toHaveBeenCalledWith(user.email, 'Password Recovery', expect.any(String));
            expect(getLastRecoveryCode()).toEqual(expect.any(String));
        });

        it('returns 204 and does not send email if user does not exist', async () => {
            await request
                .post(`${ROUTES.AUTH}/password-recovery`)
                .send({ email: 'missing-user@example.com' })
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            expect(sendEmailSpy).not.toHaveBeenCalled();
        });

        it('returns 400 for invalid payload', async () => {
            const { body } = await request
                .post(`${ROUTES.AUTH}/password-recovery`)
                .send({ email: '   ' })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        field: 'email',
                        message: 'Email field should not be empty or contain only spaces',
                    },
                ],
            });
        });
    });

    describe('POST /auth/new-password', () => {
        it('updates password for valid recovery code and invalidates old password', async () => {
            const user: CreateUserInputModel = {
                login: 'newpass01',
                password: 'secret12',
                email: 'new-password-user@example.com',
            };
            const newPassword = 'new-secret12';
            await createConfirmedUser(user);

            await request
                .post(`${ROUTES.AUTH}/password-recovery`)
                .send({ email: user.email })
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            const payload: NewPasswordInputModel = {
                newPassword,
                recoveryCode: getLastRecoveryCode(),
            };

            await request.post(`${ROUTES.AUTH}/new-password`).send(payload).expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            const loginWithOldPassword: CreateLoginInputModel = {
                loginOrEmail: user.login,
                password: user.password,
            };

            await request
                .post(`${ROUTES.AUTH}/login`)
                .send(loginWithOldPassword)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

            const loginWithNewPassword: CreateLoginInputModel = {
                loginOrEmail: user.login,
                password: newPassword,
            };

            await request.post(`${ROUTES.AUTH}/login`).send(loginWithNewPassword).expect(HTTP_STATUS_CODES.OK_200);
        });

        it('returns 400 when recovery code does not exist', async () => {
            const payload: NewPasswordInputModel = {
                newPassword: 'new-secret12',
                recoveryCode: randomUUID(),
            };

            const { body } = await request
                .post(`${ROUTES.AUTH}/new-password`)
                .send(payload)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        message: 'Invalid recovery code',
                        field: 'recoveryCode',
                    },
                ],
            });
        });

        it('returns 400 when recovery code is expired', async () => {
            const user: CreateUserInputModel = {
                login: 'expired01',
                password: 'secret12',
                email: 'expired-recovery-user@example.com',
            };
            await createConfirmedUser(user);

            await request
                .post(`${ROUTES.AUTH}/password-recovery`)
                .send({ email: user.email })
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(add(new Date(), { days: 10 }).getTime());

            const { body } = await request
                .post(`${ROUTES.AUTH}/new-password`)
                .send({ newPassword: 'new-secret12', recoveryCode: getLastRecoveryCode() })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            dateNowSpy.mockRestore();

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        message: 'Password recovery code is expired',
                        field: 'recoveryCode',
                        code: 'EXPIRED_CODE',
                    },
                ],
            });
        });

        it('returns 400 for invalid payload', async () => {
            const { body } = await request
                .post(`${ROUTES.AUTH}/new-password`)
                .send({ newPassword: '   ', recoveryCode: '   ' })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: expect.arrayContaining([
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        field: 'newPassword',
                        message: 'NewPassword field should not be empty or contain only spaces',
                    },
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        field: 'recoveryCode',
                        message: 'RecoveryCode field should not be empty or contain only spaces',
                    },
                ]),
            });
        });
    });
});
