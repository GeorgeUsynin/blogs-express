import { inject, injectable } from 'inversify';
import { type Request, type Response } from 'express';
import { parseUserAgent } from '../../../core/helpers';
import { HTTP_STATUS_CODES } from '../../../core/constants';
import { RequestWithBody } from '../../../core/types';
import { mapToMeViewModel } from './mappers/mapToMeViewModel';
import {
    CreateLoginInputModel,
    LoginOutputModel,
    MeOutputModel,
    RegistrationConfirmationInputModel,
    RegistrationEmailResendingInputModel,
} from './models';
import { CreateUserInputModel } from '../../users/api/models';
import { AuthService, RegistrationService } from '../application';
import { UsersQueryRepository } from '../../users/repository/queryRepository';

@injectable()
export class AuthController {
    constructor(
        @inject(AuthService)
        public authService: AuthService,
        @inject(RegistrationService)
        public registrationService: RegistrationService,
        @inject(UsersQueryRepository)
        public usersQueryRepository: UsersQueryRepository
    ) {}

    async me(req: Request, res: Response<MeOutputModel>) {
        const userId = req.userId!;

        const user = await this.usersQueryRepository.findByIdOrFail(userId);

        const mappedMeUser = mapToMeViewModel(user);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedMeUser);
    }

    async login(req: RequestWithBody<CreateLoginInputModel>, res: Response<LoginOutputModel>) {
        const clientIp = req.ip || '';
        const { loginOrEmail, password } = req.body;
        const deviceName = parseUserAgent(req.headers['user-agent']);

        const { accessToken, refreshToken } = await this.authService.login({ loginOrEmail, password, clientIp, deviceName });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
    }

    async logout(req: Request, res: Response) {
        const deviceId = req.deviceId!;

        await this.authService.logout(deviceId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }

    async refreshToken(req: Request, res: Response) {
        const userId = req.userId!;
        const deviceId = req.deviceId!;

        const { accessToken, refreshToken: newRefreshToken } = await this.authService.updateTokens(userId, deviceId);

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

        res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
    }

    async registration(req: Request<CreateUserInputModel>, res: Response) {
        const payload = req.body;

        await this.registrationService.registerNewUser(payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }

    async registrationConfirmation(req: Request<RegistrationConfirmationInputModel>, res: Response) {
        const payload = req.body;

        await this.registrationService.confirmRegistration(payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }

    async registrationEmailResending(req: Request<RegistrationEmailResendingInputModel>, res: Response) {
        const payload = req.body;

        await this.registrationService.resendEmailConfirmationCode(payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }
}
