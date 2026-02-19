import { NextFunction, Request, Response } from 'express';
import { container } from '../../compositionRoot';
import { ApiRateLimitService } from '../../features/apiRateLimit/application';

const apiRateLimitService: ApiRateLimitService = container.get(ApiRateLimitService);

export const apiRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    const ip = req.ip || '';
    const createdAt = new Date().toISOString();

    await apiRateLimitService.logApiRequest({ url, ip, createdAt });

    next();
};
