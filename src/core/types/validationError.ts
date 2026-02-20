import { HTTP_STATUS_CODES } from '../constants';

export type TValidationError = {
    status: HTTP_STATUS_CODES;
    message?: string;
    field?: string;
    code?: string;
};
