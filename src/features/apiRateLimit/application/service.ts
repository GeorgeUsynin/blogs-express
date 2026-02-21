import { inject, injectable } from 'inversify';
import { CreateRateLimitDto } from '../domain/dto';
import { SETTINGS } from '../../../core/settings';
import { APIRateLimitError, ErrorCodes } from '../../../core/errors';
import { ApiRateLimitRepository } from '../repository';
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
            throw new APIRateLimitError(ErrorCodes.API_RATE_LIMIT);
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
