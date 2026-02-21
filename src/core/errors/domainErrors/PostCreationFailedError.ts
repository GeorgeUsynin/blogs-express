import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class PostCreationFailedError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.POST_CREATION_FAILED);
    }
}
