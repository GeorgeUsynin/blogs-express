import { Response } from 'express';
import { RepositoryNotFoundError } from './RepositoryNotFoundError';
import { HTTP_STATUS_CODES } from '../constants';
import { createErrorMessages } from '../middlewares|validation';
import { DomainError } from './domainError';
import { BadRequestError } from './BadRequestError';
import { UnauthorizedError } from './UnauthorizedError';

export function errorsHandler(error: unknown, res: Response): void {
    if (error instanceof RepositoryNotFoundError) {
        const httpStatus = HTTP_STATUS_CODES.NOT_FOUND_404;

        res.status(httpStatus).send(
            createErrorMessages([
                {
                    status: httpStatus,
                    message: error.message,
                },
            ])
        );

        return;
    }

    if (error instanceof BadRequestError) {
        const httpStatus = HTTP_STATUS_CODES.BAD_REQUEST_400;

        res.status(httpStatus).send(
            createErrorMessages([
                {
                    status: httpStatus,
                    message: error.message,
                    field: error.field,
                },
            ])
        );

        return;
    }

    if (error instanceof UnauthorizedError) {
        const httpStatus = HTTP_STATUS_CODES.UNAUTHORIZED_401;

        if (error.message || error.jwtError?.name) {
            const responseBody = {
                status: httpStatus,
                message: error.message,
                ...(error.message ? {} : { error: JSON.stringify(error.jwtError) }),
            };

            res.status(httpStatus).send(createErrorMessages([responseBody]));
            return;
        }

        res.sendStatus(httpStatus);

        return;
    }

    if (error instanceof DomainError) {
        const httpStatus = HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY_422;

        res.status(httpStatus).send(
            createErrorMessages([
                {
                    status: httpStatus,
                    field: error.field,
                    message: error.message,
                    code: error.code,
                },
            ])
        );

        return;
    }

    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    return;
}
