import { ErrorMessages, ErrorCode } from '../constants';

export class APIRateLimitError extends Error {
    constructor(public readonly code: ErrorCode) {
        super(ErrorMessages[code]);
    }
}
