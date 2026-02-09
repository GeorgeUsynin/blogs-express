import { checkSchema } from 'express-validator';
import { basicAuthMiddleware, errorMiddleware } from '../../shared/middlewares';
import { objectIdValidation } from '../../shared/validation';
import { createUpdatePostValidationSchema } from '../validation';

export const getByIdValidators = [objectIdValidation, errorMiddleware];
export const postValidators = [
    basicAuthMiddleware,
    checkSchema(createUpdatePostValidationSchema, ['body']),
    errorMiddleware,
];
export const updateValidators = [
    basicAuthMiddleware,
    objectIdValidation,
    checkSchema(createUpdatePostValidationSchema, ['body']),
    errorMiddleware,
];
export const deleteValidators = [basicAuthMiddleware, objectIdValidation, errorMiddleware];
