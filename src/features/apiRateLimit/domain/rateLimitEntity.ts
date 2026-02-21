import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../core/settings';
import { TRateLimit, TRateLimitModel } from './types';
import { CreateRateLimitDto } from './dto';

const rateLimitSchema = new Schema<TRateLimit>({
    ip: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: String, required: true },
});

export const rateLimitStatics = {
    createRateLimit(dto: CreateRateLimitDto) {
        const newRateLImit = new RateLimitModel(dto);

        return newRateLImit;
    },
};

rateLimitSchema.statics = rateLimitStatics;

export const RateLimitModel = model<TRateLimit, TRateLimitModel>(SETTINGS.COLLECTIONS.RATE_LIMIT, rateLimitSchema);
