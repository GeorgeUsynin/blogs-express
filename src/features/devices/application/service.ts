import { inject, injectable } from 'inversify';
import { ForbiddenError } from '../../../core/errors';
import { TDevice } from '../domain';
import { DevicesRepository } from '../repository/repository';
import { CreateDeviceDto } from './dto';

@injectable()
export class DevicesService {
    constructor(
        @inject(DevicesRepository)
        private devicesRepository: DevicesRepository
    ) {}

    async create(dto: CreateDeviceDto): Promise<string> {
        const newDevice: TDevice = {
            userId: dto.userId,
            deviceId: dto.deviceId,
            clientIp: dto.clientIp,
            deviceName: dto.deviceName,
            issuedAt: dto.issuedAt,
            expiresIn: dto.expiresIn,
        };

        return this.devicesRepository.create(newDevice);
    }

    async terminateDeviceSessionByDeviceId(deviceId: string, userId: string): Promise<void> {
        const foundDevice = await this.devicesRepository.findByDeviceIdOrFail(deviceId);

        const isUserDevice = foundDevice.userId === userId;

        if (!isUserDevice) {
            throw new ForbiddenError();
        }

        await this.devicesRepository.removeByDeviceId(deviceId);

        return;
    }

    async terminateAllDeviceSessionsExceptCurrent(deviceId: string, userId: string): Promise<void> {
        await this.devicesRepository.removeAllDevicesExceptCurrent(deviceId, userId);

        return;
    }
}
