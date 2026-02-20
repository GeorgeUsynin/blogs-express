import { ErrorCode, ErrorField, ErrorMessages } from '../constants';

export class BaseDomainError extends Error {
    constructor(
        public readonly code: ErrorCode,
        public readonly field?: ErrorField
    ) {
        super(ErrorMessages[code]);
    }
}
