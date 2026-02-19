import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../core/settings';
import { DeviceDocument, TDevice, TDeviceModel } from './types';
import { CreateDeviceDto } from '../application/dto';
import { DomainError } from '../../../core/errors';

const deviceSchema = new Schema<TDevice>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true, unique: true },
    issuedAt: { type: String, required: true },
    deviceName: { type: String, required: true },
    clientIp: { type: String, required: true },
    expiresIn: { type: String, required: true },
});

export const deviceStatics = {
    createDevice(dto: CreateDeviceDto) {
        const newAuthDeviceSession = new DeviceModel(dto);

        return newAuthDeviceSession;
    },
};

export const deviceMethods = {
    isDeviceOwner(userId: string) {
        const that = this as DeviceDocument;

        if (that.userId !== userId) {
            throw new DomainError('You are not an owner', 'NOT_AN_OWNER');
        }

        return true;
    },

    isIssuedAtMatch(dateISO: string) {
        const that = this as DeviceDocument;

        return that.issuedAt === dateISO;
    },
};

deviceSchema.statics = deviceStatics;
deviceSchema.methods = deviceMethods;

export const DeviceModel = model<TDevice, TDeviceModel>(SETTINGS.COLLECTIONS.DEVICES, deviceSchema);
