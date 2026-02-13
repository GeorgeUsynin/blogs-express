import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { CreateUserInputModel } from '../../../users/api/models';
import { authService } from '../../application';

export const registrationHandler = async (req: Request<CreateUserInputModel>, res: Response) => {
    const payload = req.body;

    await authService.registerNewUser(payload);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
