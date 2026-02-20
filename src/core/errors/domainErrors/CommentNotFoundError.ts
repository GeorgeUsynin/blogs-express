import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class CommentNotFoundError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.COMMENT_NOT_FOUND);
    }
}
