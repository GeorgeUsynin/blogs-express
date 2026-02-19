import { inject, injectable } from 'inversify';
import { CreateRateLimitDto } from './dto';
import { SETTINGS } from '../../../core/settings';
import { RateLimitError } from '../../../core/errors';
import { ApiRateLimitRepository } from '../repository/repository';
import { RateLimitModel } from '../domain';

@injectable()
export class ApiRateLimitService {
    constructor(
        @inject(ApiRateLimitRepository)
        private rateLimitsRepository: ApiRateLimitRepository
    ) {}

    async logApiRequest(dto: CreateRateLimitDto): Promise<void> {
        const totalCountOfFilteredApiRequests = await this.rateLimitsRepository.getTotalCountOfFilteredAPIRequests(dto);

        if (totalCountOfFilteredApiRequests === SETTINGS.API_RATE_LIMIT_MAXIMUM_ATTEMPTS) {
            throw new RateLimitError(
                `Too many requests! Please wait for ${SETTINGS.API_RATE_LIMIT_TTL_IN_MS / 1000} seconds`
            );
        }

        const rateLimit = RateLimitModel.createRateLimit({
            url: dto.url,
            ip: dto.ip,
            createdAt: dto.createdAt,
        });

        await this.rateLimitsRepository.save(rateLimit);

        return;
    }
}
