import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { authService } from '../../application';

export const logoutHandler = async (req: Request, res: Response) => {
    const deviceId = req.deviceId!;
    const refreshToken = req.cookies.refreshToken;

    await authService.logout(deviceId, refreshToken);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
