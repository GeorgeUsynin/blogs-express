import { type Request, type Response } from 'express';
import { URIParamsDeviceModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { devicesService } from '../../application';

export const deleteDeviceByIdHandler = async (req: Request<URIParamsDeviceModel>, res: Response) => {
    const userId = req.userId!;
    const deviceId = req.params.id;

    await devicesService.terminateDeviceSessionByDeviceId(deviceId, userId);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
