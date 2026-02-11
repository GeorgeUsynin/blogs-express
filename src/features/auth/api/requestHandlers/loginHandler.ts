import { type Response } from 'express';
import { type RequestWithBody } from '../../../../core/types';
import { CreateLoginInputModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { authService } from '../../application';
import { asyncHandler } from '../../../../core/helpers';

export const loginHandler = asyncHandler(async (req: RequestWithBody<CreateLoginInputModel>, res: Response) => {
    const payload = req.body;

    await authService.login(payload);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
});
