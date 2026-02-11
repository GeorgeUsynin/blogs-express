import { checkSchema } from 'express-validator';
import { createUpdatePostValidationSchema } from '../validation';
import { errorMiddleware, objectIdValidation } from '../../../core/middlewares|validation';
import { basicAuthMiddleware } from '../../../auth|middlewares';

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
