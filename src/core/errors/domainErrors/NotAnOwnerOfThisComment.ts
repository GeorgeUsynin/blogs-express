import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class NotAnOwnerOfThisComment extends BaseDomainError {
    constructor() {
        super(ErrorCodes.NOT_AN_OWNER_OF_THIS_COMMENT);
    }
}
