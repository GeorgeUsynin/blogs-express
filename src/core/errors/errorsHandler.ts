import { Response } from 'express';
import { RepositoryNotFoundError } from './RepositoryNotFoundError';
import { HTTP_STATUS_CODES } from '../constants';
import { createErrorMessages } from '../middlewares|validation';
import { DomainError } from './domainError';

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
