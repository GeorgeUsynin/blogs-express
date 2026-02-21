import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants';
import { createErrorMessages } from '../middlewares|validation';
import { BaseDomainError } from './domainErrors';
import { UnauthorizedError } from './httpErrors/UnauthorizedError';
import { APIRateLimitError } from './httpErrors/APIRateLimitError';
import { ErrorCode, ErrorCodes } from './constants';
import { TValidationError } from '../types';

export function errorsHandler(error: unknown, res: Response): void {
    if (error instanceof BaseDomainError) {
        const status = domainErrorToHttpStatus(error.code);
        res.status(status).send(
            createErrorMessages([
                {
                    status,
                    message: error.message,
                    field: error.field,
                    code: error.code,
                },
            ])
        );

        return;
    }

    if (error instanceof UnauthorizedError) {
        const httpStatus = HTTP_STATUS_CODES.UNAUTHORIZED_401;

        const responseBody: TValidationError = {
            status: httpStatus,
        };

        if (error.message) {
            responseBody.message = error.message;
        }

        if (error.code) {
            responseBody.code = error.code;
        }

        if (Object.keys(responseBody).length === 1) {
            res.sendStatus(httpStatus);
            return;
        } else {
            res.status(httpStatus).send(createErrorMessages([responseBody]));
            return;
        }
    }

    if (error instanceof APIRateLimitError) {
        const httpStatus = HTTP_STATUS_CODES.TOO_MANY_REQUESTS_429;

        res.status(httpStatus).send(
            createErrorMessages([
                {
                    status: httpStatus,
                    message: error.message,
                    code: error.code,
                },
            ])
        );

        return;
    }

    console.error(error);

    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
}

function domainErrorToHttpStatus(code: ErrorCode) {
    switch (code) {
        case ErrorCodes.LOGIN_ALREADY_EXISTS:
        case ErrorCodes.EMAIL_ALREADY_EXISTS:
        case ErrorCodes.INVALID_CONFIRMATION_CODE:
        case ErrorCodes.INVALID_PASSWORD_RECOVERY_CODE:
        case ErrorCodes.CONFIRMATION_CODE_EXPIRED:
        case ErrorCodes.PASSWORD_RECOVERY_CODE_EXPIRED:
        case ErrorCodes.PASSWORD_RECOVERY_CODE_EXPIRED:
            return HTTP_STATUS_CODES.BAD_REQUEST_400;
        case ErrorCodes.USER_NOT_FOUND:
        case ErrorCodes.BLOG_NOT_FOUND:
        case ErrorCodes.POST_NOT_FOUND:
        case ErrorCodes.COMMENT_NOT_FOUND:
        case ErrorCodes.DEVICE_NOT_FOUND:
            return HTTP_STATUS_CODES.NOT_FOUND_404;
        case ErrorCodes.NOT_AN_OWNER_OF_THIS_DEVICE:
        case ErrorCodes.NOT_AN_OWNER_OF_THIS_COMMENT:
            return HTTP_STATUS_CODES.FORBIDDEN_403;
        case ErrorCodes.USER_CREATION_FAILED:
            return HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500;
        default:
            return HTTP_STATUS_CODES.BAD_REQUEST_400;
    }
}
