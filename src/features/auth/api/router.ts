import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';
import * as Validators from './validation';

export const AuthRouter = Router();

const AuthController = {
    login: RequestHandlers.loginHandler,
    logout: RequestHandlers.logoutHandler,
    registration: RequestHandlers.registrationHandler,
    refreshToken: RequestHandlers.refreshTokenHandler,
    registrationConfirmation: RequestHandlers.registrationConfirmationHandler,
    registrationEmailResending: RequestHandlers.registrationEmailResendingHandler,
    me: RequestHandlers.meHandler,
};

AuthRouter.get('/me', ...Validators.meValidators, AuthController.me);
AuthRouter.post('/login', ...Validators.loginValidators, AuthController.login);
AuthRouter.post('/logout', ...Validators.logoutValidators, AuthController.logout);
AuthRouter.post('/refresh-token', ...Validators.refreshTokenValidators, AuthController.refreshToken);
AuthRouter.post('/registration', ...Validators.registrationValidators, AuthController.registration);
AuthRouter.post(
    '/registration-confirmation',
    ...Validators.registrationConfirmationValidators,
    AuthController.registrationConfirmation
);
AuthRouter.post(
    '/registration-email-resending',
    ...Validators.registrationEmailResendingValidators,
    AuthController.registrationEmailResending
);
