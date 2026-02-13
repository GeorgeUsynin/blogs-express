import { checkSchema } from 'express-validator';
import { errorMiddleware } from '../../../../core/middlewares|validation';
import { createLoginValidationSchema } from './createLoginValidationSchema';
import { registrationConfirmationValidationSchema } from './registrationConfirmationValidationSchema';
import { jwtAuthMiddleware } from '../../../../auth|middlewares';
import { createUserValidationSchema } from '../../../users/api/validation';
import { registrationEmailResendingValidationSchema } from './registrationEmailResendingValidationSchema';

export const meValidators = [jwtAuthMiddleware];
export const loginValidators = [checkSchema(createLoginValidationSchema, ['body']), errorMiddleware];
export const registrationValidators = [checkSchema(createUserValidationSchema, ['body']), errorMiddleware];
export const registrationConfirmationValidators = [
    checkSchema(registrationConfirmationValidationSchema, ['body']),
    errorMiddleware,
];
export const registrationEmailResendingValidators = [
    checkSchema(registrationEmailResendingValidationSchema, ['body']),
    errorMiddleware,
];
