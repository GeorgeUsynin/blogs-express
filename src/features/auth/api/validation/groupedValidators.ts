import { checkSchema } from 'express-validator';
import { apiRateLimitMiddleware, errorMiddleware } from '../../../../core/middlewares|validation';
import { createLoginValidationSchema } from './createLoginValidationSchema';
import { registrationConfirmationValidationSchema } from './registrationConfirmationValidationSchema';
import { jwtAuthMiddleware, refreshAuthMiddleware } from '../../../../auth|middlewares';
import { createUserValidationSchema } from '../../../users/api/validation';
import { registrationEmailResendingValidationSchema } from './registrationEmailResendingValidationSchema';

export const meValidators = [jwtAuthMiddleware];
export const refreshTokenValidators = [refreshAuthMiddleware];
export const logoutValidators = [refreshAuthMiddleware];
export const loginValidators = [
    apiRateLimitMiddleware,
    checkSchema(createLoginValidationSchema, ['body']),
    errorMiddleware,
];
export const registrationValidators = [
    apiRateLimitMiddleware,
    checkSchema(createUserValidationSchema, ['body']),
    errorMiddleware,
];
export const registrationConfirmationValidators = [
    apiRateLimitMiddleware,
    checkSchema(registrationConfirmationValidationSchema, ['body']),
    errorMiddleware,
];
export const registrationEmailResendingValidators = [
    apiRateLimitMiddleware,
    checkSchema(registrationEmailResendingValidationSchema, ['body']),
    errorMiddleware,
];
