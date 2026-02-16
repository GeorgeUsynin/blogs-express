import { type Response } from 'express';
import { type RequestWithBody } from '../../../../core/types';
import { CreateLoginInputModel, LoginOutputModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { authService } from '../../application';
import { parseUserAgent } from '../../../../core/helpers';

export const loginHandler = async (req: RequestWithBody<CreateLoginInputModel>, res: Response<LoginOutputModel>) => {
    const clientIp = req.ip || '';
    const { loginOrEmail, password } = req.body;
    const deviceName = parseUserAgent(req.headers['user-agent']);

    const { accessToken, refreshToken } = await authService.login({ loginOrEmail, password, clientIp, deviceName });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
};
