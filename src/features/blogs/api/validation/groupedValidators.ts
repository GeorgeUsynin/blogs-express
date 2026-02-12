import { checkSchema } from 'express-validator';
import {
    errorMiddleware,
    objectIdValidation,
    queryPaginationAndSortParamsValidationSchema,
} from '../../../../core/middlewares|validation';
import { basicAuthMiddleware } from '../../../../auth|middlewares';
import { blogsQueryParamsValidationSchema } from './blogsQueryParamsValidationSchema';
import { PostSortFields } from '../../../posts/api/models';
import { createUpdatePostWithoutBlogIdValidationSchema } from '../../../posts/api/validation';
import { createUpdateBlogValidationSchema } from './createUpdateBlogValidationSchema';

export const getValidators = [checkSchema(blogsQueryParamsValidationSchema, ['query']), errorMiddleware];
export const getByIdValidators = [objectIdValidation, errorMiddleware];
export const getPostsByBlogIdValidators = [
    objectIdValidation,
    checkSchema(queryPaginationAndSortParamsValidationSchema(PostSortFields), ['query']),
    errorMiddleware,
];
export const postValidators = [
    basicAuthMiddleware,
    checkSchema(createUpdateBlogValidationSchema, ['body']),
    errorMiddleware,
];
export const createPostForBlogByBlogIdValidators = [
    basicAuthMiddleware,
    objectIdValidation,
    checkSchema(createUpdatePostWithoutBlogIdValidationSchema, ['body']),
    errorMiddleware,
];
export const updateValidators = [
    basicAuthMiddleware,
    objectIdValidation,
    checkSchema(createUpdateBlogValidationSchema, ['body']),
    errorMiddleware,
];
export const deleteValidators = [basicAuthMiddleware, objectIdValidation, errorMiddleware];
