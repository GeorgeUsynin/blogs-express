import { HTTP_STATUS_CODES } from '../constants';

type TError = {
    status: HTTP_STATUS_CODES;
    message: string;
    field?: string;
    code?: string;
};

export type ErrorViewModel = {
    errorsMessages: TError[];
};
