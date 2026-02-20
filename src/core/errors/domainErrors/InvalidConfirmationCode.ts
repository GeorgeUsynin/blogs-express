import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class InvalidConfirmationCode extends BaseDomainError {
    constructor() {
        super(ErrorCodes.INVALID_CONFIRMATION_CODE, ErrorFields.CODE);
    }
}
