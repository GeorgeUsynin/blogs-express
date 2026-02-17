import { Router } from 'express';
import * as Validators from './validation';
import { AuthController } from './controller';
import { container } from '../../../compositionRoot';

export const AuthRouter = Router();

const authController: AuthController = container.get(AuthController);

AuthRouter.get('/me', ...Validators.meValidators, authController.me.bind(authController));
AuthRouter.post('/login', ...Validators.loginValidators, authController.login.bind(authController));
AuthRouter.post('/logout', ...Validators.logoutValidators, authController.logout.bind(authController));
AuthRouter.post('/refresh-token', ...Validators.refreshTokenValidators, authController.refreshToken.bind(authController));
AuthRouter.post('/registration', ...Validators.registrationValidators, authController.registration.bind(authController));
AuthRouter.post(
    '/registration-confirmation',
    ...Validators.registrationConfirmationValidators,
    authController.registrationConfirmation.bind(authController)
);
AuthRouter.post(
    '/registration-email-resending',
    ...Validators.registrationEmailResendingValidators,
    authController.registrationEmailResending.bind(authController)
);
