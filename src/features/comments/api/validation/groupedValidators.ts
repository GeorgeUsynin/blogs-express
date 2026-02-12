import { checkSchema } from 'express-validator';
import { createUpdateCommentValidationSchema } from './createUpdateCommentValidationSchema';
import { errorMiddleware, objectIdValidation } from '../../../../core/middlewares|validation';
import { jwtAuthMiddleware } from '../../../../auth|middlewares';

export const getByIdValidators = [jwtAuthMiddleware, objectIdValidation, errorMiddleware];
export const updateValidators = [
    jwtAuthMiddleware,
    objectIdValidation,
    checkSchema(createUpdateCommentValidationSchema, ['body']),
    errorMiddleware,
];
export const deleteValidators = [jwtAuthMiddleware, objectIdValidation, errorMiddleware];
