import { HydratedDocument, Model } from 'mongoose';
import { rateLimitStatics } from './rateLimitEntity';

export type TRateLimit = {
    ip: string;
    url: string;
    createdAt: string;
};

type TRateLimitStatics = typeof rateLimitStatics;

export type TRateLimitModel = Model<TRateLimit> & TRateLimitStatics;

export type RateLimitDocument = HydratedDocument<TRateLimit>;
