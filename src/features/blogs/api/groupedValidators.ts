import { checkSchema } from 'express-validator';
import { basicAuthMiddleware, errorMiddleware } from '../../../core/middlewares';
import { objectIdValidation } from '../../../core/validation';
import { createUpdateBlogValidationSchema } from './validation';

export const getByIdValidators = [objectIdValidation, errorMiddleware];
export const postValidators = [
    basicAuthMiddleware,
    checkSchema(createUpdateBlogValidationSchema, ['body']),
    errorMiddleware,
];
export const updateValidators = [
    basicAuthMiddleware,
    objectIdValidation,
    checkSchema(createUpdateBlogValidationSchema, ['body']),
    errorMiddleware,
];
export const deleteValidators = [basicAuthMiddleware, objectIdValidation, errorMiddleware];
