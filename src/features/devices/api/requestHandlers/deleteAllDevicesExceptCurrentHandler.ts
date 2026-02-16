import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { devicesService } from '../../application';

export const deleteAllDevicesExceptCurrentHandler = async (req: Request, res: Response) => {
    const userId = req.userId!;
    const deviceId = req.deviceId!;

    await devicesService.terminateAllDeviceSessionsExceptCurrent(deviceId, userId);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
