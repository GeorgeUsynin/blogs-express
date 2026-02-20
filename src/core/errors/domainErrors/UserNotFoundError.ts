import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class UserNotFoundError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.USER_NOT_FOUND);
    }
}
