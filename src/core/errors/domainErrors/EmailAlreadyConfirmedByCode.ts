import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class EmailAlreadyConfirmedByCode extends BaseDomainError {
    constructor() {
        super(ErrorCodes.EMAIL_ALREADY_CONFIRMED_BY_CODE, ErrorFields.CODE);
    }
}
