import { devicesCollection } from '../../../db';
import { TDevice } from '../domain/device';
import { RepositoryNotFoundError } from '../../../core/errors';

export const devicesRepository = {
    async findByIdOrFail(id: string): Promise<TDevice> {
        const res = await devicesCollection.findOne({ _id: id });

        if (!res) {
            throw new RepositoryNotFoundError("Device doesn't exist");
        }
        return res;
    },

    async create(device: TDevice): Promise<string> {
        const { insertedId } = await devicesCollection.insertOne(device);

        return insertedId.toString();
    },

    async revokeRefreshToken(deviceId: string, revokedRefreshToken: string): Promise<void> {
        const { matchedCount } = await devicesCollection.updateOne(
            { _id: deviceId },
            {
                $push: { revokedRefreshTokens: revokedRefreshToken },
            }
        );

        if (matchedCount < 1) {
            throw new RepositoryNotFoundError("Device doesn't exist");
        }

        return;
    },
};
