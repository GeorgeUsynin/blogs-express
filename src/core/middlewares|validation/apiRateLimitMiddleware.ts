import { NextFunction, Request, Response } from 'express';
import { apiRatesLimitService } from '../../features/apiRateLimit/application';

export const apiRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    const ip = req.ip || '';
    const date = new Date().toISOString();

    await apiRatesLimitService.logApiRequest({ url, ip, date });

    next();
};
