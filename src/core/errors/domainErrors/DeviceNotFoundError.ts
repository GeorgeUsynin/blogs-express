import { ErrorCodes } from '../constants';
import { BaseDomainError } from './BaseDomainError';

export class DeviceNotFoundError extends BaseDomainError {
    constructor() {
        super(ErrorCodes.DEVICE_NOT_FOUND);
    }
}
