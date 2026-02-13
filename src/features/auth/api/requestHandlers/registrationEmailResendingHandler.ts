import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { authService } from '../../application';
import { RegistrationEmailResendingInputModel } from '../models';

export const registrationEmailResendingHandler = async (
    req: Request<RegistrationEmailResendingInputModel>,
    res: Response
) => {
    const payload = req.body;

    await authService.resendEmailConfirmationCode(payload);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
