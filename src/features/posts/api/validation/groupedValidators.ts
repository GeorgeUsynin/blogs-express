import { checkSchema } from 'express-validator';
import { createUpdatePostValidationSchema } from './createUpdatePostValidationSchema';
import { errorMiddleware, objectIdValidation } from '../../../../core/middlewares|validation';
import { basicAuthMiddleware, jwtAuthMiddleware } from '../../../../auth|middlewares';
import { postsQueryParamsValidationSchema } from './postsQueryParamsValidationSchema';
import {
    commentsQueryParamsValidationSchema,
    createUpdateCommentValidationSchema,
} from '../../../comments/api/validation';

export const getValidators = [checkSchema(postsQueryParamsValidationSchema, ['query']), errorMiddleware];
export const getByIdValidators = [objectIdValidation, errorMiddleware];
export const getAllCommentsByPostIdValidator = [
    objectIdValidation,
    checkSchema(commentsQueryParamsValidationSchema, ['query']),
    errorMiddleware,
];
export const createCommentByPostIdValidator = [
    jwtAuthMiddleware,
    objectIdValidation,
    checkSchema(createUpdateCommentValidationSchema, ['body']),
    errorMiddleware,
];
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
