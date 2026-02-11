import { checkSchema } from 'express-validator';
import { errorMiddleware, objectIdValidation } from '../../../../core/middlewares|validation';
import { basicAuthMiddleware } from '../../../../auth|middlewares';
import { queryParamsValidationSchema } from './queryParamsValidationSchema';

import { createUserValidationSchema } from './createUserValidationSchema';

export const getValidators = [
    basicAuthMiddleware,
    checkSchema(queryParamsValidationSchema, ['query']),
    errorMiddleware,
];
export const postValidators = [basicAuthMiddleware, checkSchema(createUserValidationSchema, ['body']), errorMiddleware];
export const deleteValidators = [basicAuthMiddleware, objectIdValidation, errorMiddleware];
