import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class PostNotFoundError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.POST_NOT_FOUND);
    }
}
