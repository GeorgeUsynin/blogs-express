import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { DeviceDocument, DeviceModel, TDevice } from '../domain';

@injectable()
export class DevicesRepository {
    async findByDeviceId(id: string): Promise<DeviceDocument | null> {
        return DeviceModel.findOne({ deviceId: id });
    }

    async removeByDeviceId(id: string): Promise<void> {
        await DeviceModel.deleteOne({ deviceId: id });
    }

    async removeAllDevicesExceptCurrent(deviceId: string, userId: string): Promise<void> {
        await DeviceModel.deleteMany({ userId, deviceId: { $ne: deviceId } });
    }

    async save(device: DeviceDocument): Promise<string> {
        const newDevice = await device.save();

        return newDevice._id.toString();
    }
}
