import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class LoginAlreadyExistsError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.LOGIN_ALREADY_EXISTS, ErrorFields.LOGIN);
    }
}
