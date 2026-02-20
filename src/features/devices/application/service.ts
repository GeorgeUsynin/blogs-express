import { WithId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { DeviceModel, TDevice } from '../domain';
import { DevicesRepository } from '../repository/repository';
import { CreateDeviceDto } from './dto';
import { DeviceNotFoundError } from '../../../core/errors';

@injectable()
export class DevicesService {
    constructor(
        @inject(DevicesRepository)
        private devicesRepository: DevicesRepository
    ) {}

    async create(dto: CreateDeviceDto): Promise<WithId<TDevice>> {
        const newDevice = DeviceModel.createDevice({
            userId: dto.userId,
            deviceId: dto.deviceId,
            clientIp: dto.clientIp,
            deviceName: dto.deviceName,
            issuedAt: dto.issuedAt,
            expiresIn: dto.expiresIn,
        });

        return this.devicesRepository.save(newDevice);
    }

    async terminateDeviceSessionByDeviceId(deviceId: string, userId: string): Promise<void> {
        const foundDevice = await this.devicesRepository.findByDeviceId(deviceId);

        if (!foundDevice) {
            throw new DeviceNotFoundError();
        }

        foundDevice.ensureDeviceOwner(userId);

        await this.devicesRepository.removeByDeviceId(deviceId);
    }

    async terminateAllDeviceSessionsExceptCurrent(deviceId: string, userId: string): Promise<void> {
        await this.devicesRepository.removeAllDevicesExceptCurrent(deviceId, userId);

        return;
    }
}
