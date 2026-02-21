import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class UserCreationFailedError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.USER_CREATION_FAILED);
    }
}
