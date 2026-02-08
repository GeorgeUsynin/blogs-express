import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants';
import { ValidationError, validationResult } from 'express-validator';

const formatErrors = (error: ValidationError) => ({
    field: error.type === 'field' ? error.path : '',
    message: error.msg,
});

export const errorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });

    if (errors.length) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({ errorsMessages: errors });
    }

    next();
};
