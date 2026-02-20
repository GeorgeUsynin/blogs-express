import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class BlogNotFoundError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.BLOG_NOT_FOUND);
    }
}
