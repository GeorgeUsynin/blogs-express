import { WithId } from 'mongodb';
import { TDevice } from '../../domain';
import { DeviceViewModel } from '../models';

export const mapToDeviceViewModel = (device: WithId<TDevice>): DeviceViewModel => ({
    ip: device.clientIp,
    title: device.deviceName,
    lastActiveDate: device.issuedAt,
    deviceId: device.deviceId,
});
