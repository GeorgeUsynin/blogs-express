import { injectable } from 'inversify';
import { SETTINGS } from '../../../core/settings';
import { apiRateLimitCollection } from '../../../db';
import { RateLimitInputDto } from '../application/dto';
import { TRateLimit } from '../domain';

@injectable()
export class ApiRateLimitRepository {
    async getTotalCountOfFilteredAPIRequests(dto: RateLimitInputDto): Promise<number> {
        const startDate = new Date(Date.parse(dto.date) - SETTINGS.API_RATE_LIMIT_TTL_IN_MS).toISOString();
        const endDate = dto.date;

        const totalCount = await apiRateLimitCollection.countDocuments({
            url: dto.url,
            ip: dto.ip,
            createdAt: { $gte: startDate, $lt: endDate },
        });

        return totalCount;
    }

    async create(rateLimit: TRateLimit): Promise<void> {
        await apiRateLimitCollection.insertOne(rateLimit);

        return;
    }
}
