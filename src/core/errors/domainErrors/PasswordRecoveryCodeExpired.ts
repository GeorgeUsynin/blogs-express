import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class PasswordRecoveryCodeExpired extends BaseDomainError {
    constructor() {
        super(ErrorCodes.PASSWORD_RECOVERY_CODE_EXPIRED, ErrorFields.RECOVERY_CODE);
    }
}
