import { WithId } from 'mongodb';
import { devicesCollection } from '../../../db';
import { TDevice } from '../domain/device';
import { RepositoryNotFoundError } from '../../../core/errors';

type TDeviceAttributes = {
    issuedAt: string;
    expiresIn: string;
};

export const devicesRepository = {
    async findByDeviceIdOrFail(id: string): Promise<TDevice> {
        const res = await devicesCollection.findOne({ deviceId: id });

        if (!res) {
            throw new RepositoryNotFoundError("Device doesn't exist");
        }
        return res;
    },

    async findByDeviceId(id: string): Promise<WithId<TDevice> | null> {
        const res = await devicesCollection.findOne({ deviceId: id });

        return res;
    },

    async create(device: TDevice): Promise<string> {
        const { insertedId } = await devicesCollection.insertOne(device);

        return insertedId.toString();
    },

    async updateByDeviceId(deviceId: string, deviceAttributes: TDeviceAttributes) {
        const { matchedCount } = await devicesCollection.updateOne(
            { deviceId },
            {
                $set: {
                    issuedAt: deviceAttributes.issuedAt,
                    expiresIn: deviceAttributes.expiresIn,
                },
            }
        );

        if (matchedCount < 1) {
            throw new RepositoryNotFoundError("Device doesn't exist");
        }

        return;
    },

    async removeByDeviceId(id: string): Promise<void> {
        const { deletedCount } = await devicesCollection.deleteOne({ deviceId: id });

        if (deletedCount < 1) {
            throw new RepositoryNotFoundError("Device doesn't exist");
        }

        return;
    },

    async removeAllDevicesExceptCurrent(deviceId: string, userId: string): Promise<void> {
        await devicesCollection.deleteMany({ userId, deviceId: { $ne: deviceId } });

        return;
    },
};
