import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants';
import { FieldValidationError, ValidationError, validationResult } from 'express-validator';
import { TValidationError } from '../types';
import { ErrorViewModel } from '../models';

export const createErrorMessages = (errors: TValidationError[]): ErrorViewModel => {
    return {
        errorsMessages: errors.map(error => ({
            status: error.status,
            message: error.message,
            ...(error.field !== undefined ? { field: error.field } : {}),
            ...(error.code !== undefined ? { code: error.code } : {}),
        })),
    };
};

const formatValidationError = (error: ValidationError): TValidationError => {
    const expressError = error as unknown as FieldValidationError;

    return {
        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
        field: expressError.type === 'field' ? expressError.path : '',
        message: expressError.msg,
    };
};

export const errorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(formatValidationError).array({ onlyFirstError: true });

    if (errors.length > 0) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json(createErrorMessages(errors));
        return;
    }

    next();
};
