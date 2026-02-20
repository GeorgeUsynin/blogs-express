import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class ConfirmationCodeExpired extends BaseDomainError {
    constructor() {
        super(ErrorCodes.CONFIRMATION_CODE_EXPIRED, ErrorFields.CODE);
    }
}
