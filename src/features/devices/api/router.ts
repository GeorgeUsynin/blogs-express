import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';
import * as Validators from './validation';

export const SecurityDevicesRouter = Router();

const DevicesController = {
    getAllDevices: RequestHandlers.getAllDevicesHandler,
    deleteAllDevicesExceptCurrent: RequestHandlers.deleteAllDevicesExceptCurrentHandler,
    deleteDeviceById: RequestHandlers.deleteDeviceByIdHandler,
};

SecurityDevicesRouter.get('/', ...Validators.getAllDevicesValidators, DevicesController.getAllDevices);
SecurityDevicesRouter.delete(
    '',
    ...Validators.deleteAllDevicesExceptCurrentValidators,
    DevicesController.deleteAllDevicesExceptCurrent
);
SecurityDevicesRouter.delete('/:id', ...Validators.deleteDeviceByIdValidators, DevicesController.deleteDeviceById);
