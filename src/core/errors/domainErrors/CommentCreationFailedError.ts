import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class CommentCreationFailedError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.COMMENT_CREATION_FAILED);
    }
}
