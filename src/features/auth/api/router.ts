import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';
import * as Validators from './validation';

export const AuthRouter = Router();

const AuthController = {
    login: RequestHandlers.loginHandler,
    registration: RequestHandlers.registrationHandler,
    registrationConfirmation: RequestHandlers.registrationConfirmationHandler,
    registrationEmailResending: RequestHandlers.registrationEmailResendingHandler,
    me: RequestHandlers.meHandler,
};

AuthRouter.get('/me', ...Validators.meValidators, AuthController.me);
AuthRouter.post('/login', ...Validators.loginValidators, AuthController.login);
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
