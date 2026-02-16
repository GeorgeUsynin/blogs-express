import { refreshAuthMiddleware } from '../../../../auth|middlewares';
import { errorMiddleware, uuIdValidation } from '../../../../core/middlewares|validation';

export const getAllDevicesValidators = [refreshAuthMiddleware];
export const deleteAllDevicesExceptCurrentValidators = [refreshAuthMiddleware];
export const deleteDeviceByIdValidators = [refreshAuthMiddleware, uuIdValidation, errorMiddleware];
