import { checkSchema } from 'express-validator';
import { createUpdateBlogValidationSchema } from '.';
import { errorMiddleware, objectIdValidation } from '../../../../core/middlewares|validation';
import { basicAuthMiddleware } from '../../../../auth|middlewares';
import { queryParamsValidationSchema } from './queryParamsValidationSchema';

export const getValidators = [checkSchema(queryParamsValidationSchema, ['query']), errorMiddleware];
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
