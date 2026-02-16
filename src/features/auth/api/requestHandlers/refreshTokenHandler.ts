import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { authService } from '../../application';

export const refreshTokenHandler = async (req: Request, res: Response) => {
    const userId = req.userId!;
    const deviceId = req.deviceId!;

    const { accessToken, refreshToken: newRefreshToken } = await authService.updateTokens(userId, deviceId);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

    res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
};
