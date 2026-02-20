import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class InvalidPasswordRecoveryCode extends BaseDomainError {
    constructor() {
        super(ErrorCodes.INVALID_PASSWORD_RECOVERY_CODE, ErrorFields.RECOVERY_CODE);
    }
}
