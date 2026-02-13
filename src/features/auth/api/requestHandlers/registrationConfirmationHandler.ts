import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { authService } from '../../application';
import { RegistrationConfirmationInputModel } from '../models';

export const registrationConfirmationHandler = async (
    req: Request<RegistrationConfirmationInputModel>,
    res: Response
) => {
    const payload = req.body;

    await authService.confirmRegistration(payload);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
