import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class NotAnOwnerOfThisDevice extends BaseDomainError {
    constructor() {
        super(ErrorCodes.NOT_AN_OWNER_OF_THIS_DEVICE);
    }
}
