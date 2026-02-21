import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class LikeNotFoundError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.LIKE_NOT_FOUND);
    }
}
