import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { DeviceDocument, DeviceModel, TDevice } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

@injectable()
export class DevicesRepository {
    async findByDeviceIdOrFail(id: string): Promise<DeviceDocument> {
        const res = await DeviceModel.findOne({ deviceId: id });

        if (!res) {
            throw new RepositoryNotFoundError("Device doesn't exist");
        }
        return res;
    }

    async findByDeviceId(id: string): Promise<DeviceDocument | null> {
        const res = await DeviceModel.findOne({ deviceId: id });

        return res;
    }

    async removeByDeviceId(id: string): Promise<void> {
        const { deletedCount } = await DeviceModel.deleteOne({ deviceId: id });

        if (deletedCount < 1) {
            throw new RepositoryNotFoundError("Device doesn't exist");
        }

        return;
    }

    async removeAllDevicesExceptCurrent(deviceId: string, userId: string): Promise<void> {
        await DeviceModel.deleteMany({ userId, deviceId: { $ne: deviceId } });

        return;
    }

    async save(device: DeviceDocument): Promise<WithId<TDevice>> {
        return device.save();
    }
}
