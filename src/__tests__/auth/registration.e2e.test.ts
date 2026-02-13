import { add } from 'date-fns/add';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { CreateLoginInputModel, RegistrationConfirmationInputModel } from '../../features/auth/api/models';
import { CreateUserInputModel } from '../../features/users/api/models';
import { usersRepository } from '../../features/users/repository';
import { emailManager } from '../../shared/managers';
import { dbHelper, getAuthorization, request } from '../test-helpers';

describe('auth registration-related endpoints', () => {
    let sendConfirmationEmailSpy: jest.SpyInstance;

    beforeAll(async () => {
        await dbHelper.connectToDb();
        sendConfirmationEmailSpy = jest.spyOn(emailManager, 'sendConfirmationEmail').mockImplementation(() => {});
    });

    afterEach(async () => {
        await request.delete(ROUTES.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
        sendConfirmationEmailSpy.mockClear();
    });

    afterAll(async () => {
        sendConfirmationEmailSpy.mockRestore();
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const registrationPayload: CreateUserInputModel = {
        login: 'new_user',
        password: 'secret12',
        email: 'new-user@example.com',
    };

    describe('POST /auth/registration', () => {
        it('creates an unconfirmed user and does not allow login before confirmation', async () => {
            await request
                .post(`${ROUTES.AUTH}/registration`)
                .send(registrationPayload)
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            expect(sendConfirmationEmailSpy).toHaveBeenCalledTimes(1);
            expect(sendConfirmationEmailSpy).toHaveBeenCalledWith(
                registrationPayload.email,
                expect.any(String)
            );

            const payload: CreateLoginInputModel = {
                loginOrEmail: registrationPayload.login,
                password: registrationPayload.password,
            };

            const { body } = await request
                .post(`${ROUTES.AUTH}/login`)
                .send(payload)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.UNAUTHORIZED_401,
                        message: 'Email address is not confirmed',
                        code: 'EMAIL_NOT_CONFIRMED',
                    },
                ],
            });
        });

        it('returns 400 when login is not unique', async () => {
            await request
                .post(`${ROUTES.AUTH}/registration`)
                .send(registrationPayload)
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            const { body } = await request
                .post(`${ROUTES.AUTH}/registration`)
                .send({ ...registrationPayload, email: 'second-user@example.com' })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        message: 'The login is not unique',
                        field: 'login',
                    },
                ],
            });
        });

        it('returns 400 for invalid payload', async () => {
            const { body } = await request
                .post(`${ROUTES.AUTH}/registration`)
                .send({
                    login: '  ',
                    password: '123',
                })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: expect.arrayContaining([
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        field: 'login',
                        message: 'Login field should not be empty or contain only spaces',
                    },
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        field: 'password',
                        message: 'Password length should be from 6 to 20 characters',
                    },
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        field: 'email',
                        message: 'Email field is required',
                    },
                ]),
            });
        });
    });

    describe('POST /auth/registration-confirmation', () => {
        const createUnconfirmedUser = async () => {
            await request
                .post(`${ROUTES.AUTH}/registration`)
                .send(registrationPayload)
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            const user = await usersRepository.findUserByEmail(registrationPayload.email);
            expect(user).not.toBeNull();
            return user!;
        };

        it('confirms registration and allows login', async () => {
            const createdUser = await createUnconfirmedUser();

            const payload: RegistrationConfirmationInputModel = {
                code: createdUser.emailConfirmation.confirmationCode,
            };

            await request
                .post(`${ROUTES.AUTH}/registration-confirmation`)
                .send(payload)
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            await request
                .post(`${ROUTES.AUTH}/login`)
                .send({
                    loginOrEmail: registrationPayload.login,
                    password: registrationPayload.password,
                })
                .expect(HTTP_STATUS_CODES.OK_200);
        });

        it('returns 400 for invalid confirmation code', async () => {
            const { body } = await request
                .post(`${ROUTES.AUTH}/registration-confirmation`)
                .send({ code: 'unknown-code' })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        message: 'Invalid confirmation code',
                        field: 'code',
                    },
                ],
            });
        });

        it('returns 400 when confirmation code is already applied', async () => {
            const createdUser = await createUnconfirmedUser();
            const payload: RegistrationConfirmationInputModel = {
                code: createdUser.emailConfirmation.confirmationCode,
            };

            await request
                .post(`${ROUTES.AUTH}/registration-confirmation`)
                .send(payload)
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            const { body } = await request
                .post(`${ROUTES.AUTH}/registration-confirmation`)
                .send(payload)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        message: 'Confirmation code already been applied',
                        field: 'code',
                    },
                ],
            });
        });

        it('returns 400 when confirmation code is expired', async () => {
            const createdUser = await createUnconfirmedUser();
            const expiredDate = add(new Date(), { minutes: -1 }).toISOString();

            await usersRepository.updateEmailConfirmationAttributes(
                createdUser._id.toString(),
                createdUser.emailConfirmation.confirmationCode,
                expiredDate
            );

            const { body } = await request
                .post(`${ROUTES.AUTH}/registration-confirmation`)
                .send({ code: createdUser.emailConfirmation.confirmationCode })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        message: 'Confirmation code is expired',
                        field: 'code',
                    },
                ],
            });
        });
    });

    describe('POST /auth/registration-email-resending', () => {
        const createUnconfirmedUser = async () => {
            await request
                .post(`${ROUTES.AUTH}/registration`)
                .send(registrationPayload)
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            const user = await usersRepository.findUserByEmail(registrationPayload.email);
            expect(user).not.toBeNull();
            return user!;
        };

        it('resends confirmation email, rotates code and invalidates previous code', async () => {
            const createdUser = await createUnconfirmedUser();
            const oldCode = createdUser.emailConfirmation.confirmationCode;

            await request
                .post(`${ROUTES.AUTH}/registration-email-resending`)
                .send({ email: registrationPayload.email })
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            expect(sendConfirmationEmailSpy).toHaveBeenCalledTimes(2);
            expect(sendConfirmationEmailSpy).toHaveBeenLastCalledWith(registrationPayload.email, expect.any(String));

            const updatedUser = await usersRepository.findUserByEmail(registrationPayload.email);
            expect(updatedUser).not.toBeNull();
            expect(updatedUser!.emailConfirmation.confirmationCode).not.toBe(oldCode);

            const { body: invalidOldCodeBody } = await request
                .post(`${ROUTES.AUTH}/registration-confirmation`)
                .send({ code: oldCode })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(invalidOldCodeBody).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        message: 'Invalid confirmation code',
                        field: 'code',
                    },
                ],
            });
        });

        it('returns 400 when email does not exist', async () => {
            const { body } = await request
                .post(`${ROUTES.AUTH}/registration-email-resending`)
                .send({ email: 'missing-user@example.com' })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        message: 'Invalid email',
                        field: 'email',
                    },
                ],
            });
        });

        it('returns 400 when user is already confirmed', async () => {
            await request
                .post(ROUTES.USERS)
                .set(getAuthorization())
                .send(registrationPayload)
                .expect(HTTP_STATUS_CODES.CREATED_201);

            const { body } = await request
                .post(`${ROUTES.AUTH}/registration-email-resending`)
                .send({ email: registrationPayload.email })
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(body).toEqual({
                errorsMessages: [
                    {
                        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                        message: 'Confirmation code already been applied',
                        field: 'code',
                    },
                ],
            });
        });

        it('returns 400 for invalid payload', async () => {
            const { body } = await request
                .post(`${ROUTES.AUTH}/registration-email-resending`)
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
});
