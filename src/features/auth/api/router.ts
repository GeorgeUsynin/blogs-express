import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandlers from './requestHandlers';
import { createLoginValidationSchema } from './validation';
import { errorMiddleware } from '../../../core/middlewares|validation';
import { jwtAuthMiddleware } from '../../../auth|middlewares';

export const AuthRouter = Router();

const AuthController = {
    login: RequestHandlers.loginHandler,
    me: RequestHandlers.meHandler,
};

AuthRouter.get('/me', jwtAuthMiddleware, AuthController.me);
AuthRouter.post('/login', checkSchema(createLoginValidationSchema, ['body']), errorMiddleware, AuthController.login);
