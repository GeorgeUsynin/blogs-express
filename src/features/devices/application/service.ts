import { ForbiddenError } from '../../../core/errors';
import { TDevice } from '../domain';
import { devicesRepository } from '../repository';
import { CreateDeviceDto } from './dto';

export const devicesService = {
    async create(dto: CreateDeviceDto): Promise<string> {
        const newDevice: TDevice = {
            userId: dto.userId,
            deviceId: dto.deviceId,
            clientIp: dto.clientIp,
            deviceName: dto.deviceName,
            issuedAt: dto.issuedAt,
            expiresIn: dto.expiresIn,
        };

        return devicesRepository.create(newDevice);
    },

    async terminateDeviceSessionByDeviceId(deviceId: string, userId: string): Promise<void> {
        const foundDevice = await devicesRepository.findByDeviceIdOrFail(deviceId);

        const isUserDevice = foundDevice.userId === userId;

        if (!isUserDevice) {
            throw new ForbiddenError();
        }

        await devicesRepository.removeByDeviceId(deviceId);

        return;
    },

    async terminateAllDeviceSessionsExceptCurrent(deviceId: string, userId: string): Promise<void> {
        await devicesRepository.removeAllDevicesExceptCurrent(deviceId, userId);

        return;
    },
};
