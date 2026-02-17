import { Router } from 'express';
import * as Validators from './validation';
import { DevicesController } from './controller';
import { container } from '../../../compositionRoot';

export const SecurityDevicesRouter = Router();

const devicesController: DevicesController = container.get(DevicesController);

SecurityDevicesRouter.get('/', ...Validators.getAllDevicesValidators, devicesController.getAllDevices.bind(devicesController));
SecurityDevicesRouter.delete(
    '',
    ...Validators.deleteAllDevicesExceptCurrentValidators,
    devicesController.deleteAllDevicesExceptCurrent.bind(devicesController)
);
SecurityDevicesRouter.delete(
    '/:id',
    ...Validators.deleteDeviceByIdValidators,
    devicesController.deleteDeviceById.bind(devicesController)
);
