import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class BlogCreationFailedError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.BLOG_CREATION_FAILED);
    }
}
