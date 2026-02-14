import { randomUUID } from 'crypto';
import { TDevice } from '../domain/device';
import { devicesRepository } from '../repository';

export const devicesService = {
    async create(userId: string): Promise<string> {
        const newDevice: TDevice = {
            _id: randomUUID(),
            userId,
            revokedRefreshTokens: [],
        };

        return devicesRepository.create(newDevice);
    },
};
