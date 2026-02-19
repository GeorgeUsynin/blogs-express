import { injectable } from 'inversify';
import { SETTINGS } from '../../../core/settings';
import { CreateRateLimitDto } from '../application/dto';
import { RateLimitDocument, RateLimitModel } from '../domain';

@injectable()
export class ApiRateLimitRepository {
    async getTotalCountOfFilteredAPIRequests(dto: CreateRateLimitDto): Promise<number> {
        const startDate = new Date(Date.parse(dto.createdAt) - SETTINGS.API_RATE_LIMIT_TTL_IN_MS).toISOString();
        const endDate = dto.createdAt;

        const totalCount = await RateLimitModel.countDocuments({
            url: dto.url,
            ip: dto.ip,
            createdAt: { $gte: startDate, $lt: endDate },
        });

        return totalCount;
    }

    async save(rateLimit: RateLimitDocument): Promise<void> {
        await rateLimit.save();
    }
}
