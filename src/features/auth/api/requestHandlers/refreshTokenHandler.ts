import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { authService } from '../../application';

export const refreshTokenHandler = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.userId!;
    const deviceId = req.deviceId!;

    const refreshSession = { userId, deviceId, refreshToken };

    const { accessToken, refreshToken: newRefreshToken } = await authService.updateTokens(refreshSession);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

    res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
};
