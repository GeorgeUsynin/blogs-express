import { TRateLimit } from '../domain';
import { RateLimitInputDto } from './dto';
import { rateLimitsRepository } from '../repository';
import { SETTINGS } from '../../../core/settings';
import { RateLimitError } from '../../../core/errors';

export const apiRatesLimitService = {
    async logApiRequest(dto: RateLimitInputDto): Promise<void> {
        const totalCountOfFilteredApiRequests = await rateLimitsRepository.getTotalCountOfFilteredAPIRequests(dto);

        if (totalCountOfFilteredApiRequests === SETTINGS.API_RATE_LIMIT_MAXIMUM_ATTEMPTS) {
            throw new RateLimitError(
                `Too many requests! Please wait for ${SETTINGS.API_RATE_LIMIT_TTL_IN_MS / 1000} seconds`
            );
        }

        const rateLimit: TRateLimit = {
            url: dto.url,
            ip: dto.ip,
            createdAt: dto.date,
        };

        await rateLimitsRepository.create(rateLimit);

        return;
    },
};
