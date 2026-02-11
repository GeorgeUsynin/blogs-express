import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandlers from './requestHandlers';
import { createLoginValidationSchema } from './validation';
import { errorMiddleware } from '../../../core/middlewares|validation';

export const AuthRouter = Router();

const AuthController = {
    login: RequestHandlers.loginHandler,
};

AuthRouter.post('/login', checkSchema(createLoginValidationSchema, ['body']), errorMiddleware, AuthController.login);
