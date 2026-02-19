import { HydratedDocument, Model } from 'mongoose';
import { deviceMethods, deviceStatics } from './deviceEntity';

export type TDevice = {
    userId: string;
    deviceId: string;
    issuedAt: string;
    deviceName: string;
    clientIp: string;
    expiresIn: string;
};

type TDeviceStatics = typeof deviceStatics;
type TDeviceMethods = typeof deviceMethods;

export type TDeviceModel = Model<TDevice, {}, TDeviceMethods> & TDeviceStatics;

export type DeviceDocument = HydratedDocument<TDevice, TDeviceMethods>;
