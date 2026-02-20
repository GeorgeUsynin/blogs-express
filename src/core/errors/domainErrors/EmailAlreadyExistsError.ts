import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class EmailAlreadyExistsError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.EMAIL_ALREADY_EXISTS, ErrorFields.EMAIL);
    }
}
