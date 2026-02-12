import { type Response } from 'express';
import { type RequestWithBody } from '../../../../core/types';
import { CreateLoginInputModel, LoginOutputModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { authService } from '../../application';

export const loginHandler = async (req: RequestWithBody<CreateLoginInputModel>, res: Response<LoginOutputModel>) => {
        const payload = req.body;

        const accessToken = await authService.login(payload);

        res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
    }
