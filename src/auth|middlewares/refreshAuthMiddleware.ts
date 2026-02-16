import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../core/constants';
import { jwtService } from '../features/auth/application';
import { devicesRepository } from '../features/devices/repository';

export const refreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    // verifyToken also checking expiration date under the hood
    const { deviceId, userId, iat } = jwtService.verifyToken<'refresh'>(refreshToken);
    const device = await devicesRepository.findByDeviceId(deviceId);

    if (!device) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const isTokenOwner = device.userId === userId;
    if (!isTokenOwner) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const isRefreshTokenVersionValid = device.issuedAt === new Date(iat! * 1000).toISOString();

    if (!isRefreshTokenVersionValid) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    req.deviceId = deviceId;
    req.userId = userId;

    next();
};
