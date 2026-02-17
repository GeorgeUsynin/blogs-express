import { inject, injectable } from 'inversify';
import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../core/constants';
import { mapToDeviceViewModel } from './mappers';
import { DeviceViewModel, URIParamsDeviceModel } from './models';
import { DevicesService } from '../application/service';
import { DevicesQueryRepository } from '../repository/queryRepository';

@injectable()
export class DevicesController {
    constructor(
        @inject(DevicesService)
        private devicesService: DevicesService,
        @inject(DevicesQueryRepository)
        private devicesQueryRepository: DevicesQueryRepository
    ) {}

    async getAllDevices(req: Request, res: Response<DeviceViewModel[]>) {
        const userId = req.userId!;

        const items = await this.devicesQueryRepository.findManyByUserId(userId);

        const devicesListOutput = items.map(mapToDeviceViewModel);

        res.status(HTTP_STATUS_CODES.OK_200).send(devicesListOutput);
    }

    async deleteAllDevicesExceptCurrent(req: Request, res: Response) {
        const userId = req.userId!;
        const deviceId = req.deviceId!;

        await this.devicesService.terminateAllDeviceSessionsExceptCurrent(deviceId, userId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }

    async deleteDeviceById(req: Request<URIParamsDeviceModel>, res: Response) {
        const userId = req.userId!;
        const deviceId = req.params.id;

        await this.devicesService.terminateDeviceSessionByDeviceId(deviceId, userId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }
}
