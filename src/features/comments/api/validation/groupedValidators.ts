import { checkSchema } from 'express-validator';
import { createUpdateCommentValidationSchema } from './createUpdateCommentValidationSchema';
import { errorMiddleware, objectIdValidation } from '../../../../core/middlewares|validation';
import { jwtAuthMiddleware } from '../../../../auth|middlewares';
import { createUpdateLikeStatusValidationSchema } from '../../../likes/api/validation';
import { getUserIdFromAccessTokenMiddleware } from '../../../../core/middlewares|validation';

export const getByIdValidators = [getUserIdFromAccessTokenMiddleware, objectIdValidation, errorMiddleware];
export const updateValidators = [
    jwtAuthMiddleware,
    objectIdValidation,
    checkSchema(createUpdateCommentValidationSchema, ['body']),
    errorMiddleware,
];
export const createUpdateLikeStatusValidators = [
    jwtAuthMiddleware,
    objectIdValidation,
    checkSchema(createUpdateLikeStatusValidationSchema, ['body']),
    errorMiddleware,
];
export const deleteValidators = [jwtAuthMiddleware, objectIdValidation, errorMiddleware];
