import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToDeviceViewModel } from '../mappers';
import { DeviceViewModel } from '../models';
import { devicesQueryRepository } from '../../repository';

export const getAllDevicesHandler = async (req: Request, res: Response<DeviceViewModel[]>) => {
    const userId = req.userId!;

    const items = await devicesQueryRepository.findManyByUserId(userId);

    const devicesListOutput = items.map(mapToDeviceViewModel);

    res.status(HTTP_STATUS_CODES.OK_200).send(devicesListOutput);
};
