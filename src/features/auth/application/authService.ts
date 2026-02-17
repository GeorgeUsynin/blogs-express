import { randomUUID } from 'crypto';
import { inject, injectable } from 'inversify';
import { UnauthorizedError } from '../../../core/errors';
import { SETTINGS } from '../../../core/settings';
import { DevicesService } from '../../devices/application/service';
import { DevicesRepository } from '../../devices/repository/repository';
import { UsersRepository } from '../../users/repository/repository';
import { CreateLoginDto } from './dto';
import { JwtService } from './jwtService';
import { PasswordService } from './passwordService';

@injectable()
export class AuthService {
    constructor(
        @inject(UsersRepository)
        public usersRepository: UsersRepository,
        @inject(PasswordService)
        public passwordService: PasswordService,
        @inject(JwtService)
        public jwtService: JwtService,
        @inject(DevicesService)
        public devicesService: DevicesService,
        @inject(DevicesRepository)
        public devicesRepository: DevicesRepository
    ) {}

    async login(loginAttributes: CreateLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const { loginOrEmail, password, clientIp, deviceName } = loginAttributes;

        const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw new UnauthorizedError();
        }

        const isValidPassword = await this.passwordService.comparePassword(password, user.passwordHash);

        if (!isValidPassword) {
            throw new UnauthorizedError();
        }

        if (!user.emailConfirmation.isConfirmed) {
            throw new UnauthorizedError('Email address is not confirmed', 'EMAIL_NOT_CONFIRMED');
        }

        const uniqueDeviceId = randomUUID();

        const { accessToken, refreshToken } = this._generateTokens(user._id.toString(), uniqueDeviceId);

        const { iat, exp } = this.jwtService.verifyToken<'refresh'>(refreshToken);
        const issuedAt = new Date(iat! * 1000).toISOString();
        const expiresIn = new Date(exp! * 1000).toISOString();

        await this.devicesService.create({
            userId: user._id.toString(),
            deviceId: uniqueDeviceId,
            clientIp,
            deviceName,
            issuedAt,
            expiresIn,
        });

        return { accessToken, refreshToken };
    }

    async logout(deviceId: string): Promise<void> {
        await this.devicesRepository.removeByDeviceId(deviceId);

        return;
    }

    async updateTokens(
        userId: string,
        deviceId: string
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const { accessToken, refreshToken } = this._generateTokens(userId, deviceId);

        const { iat, exp } = this.jwtService.verifyToken<'refresh'>(refreshToken);
        const issuedAt = new Date(iat! * 1000).toISOString();
        const expiresIn = new Date(exp! * 1000).toISOString();
        const payload = { issuedAt, expiresIn };

        await this.devicesRepository.updateByDeviceId(deviceId, payload);

        return { accessToken, refreshToken };
    }

    _generateTokens(userId: string, deviceId: string) {
        const accessToken = this.jwtService.createJwtToken<'access'>(
            { userId },
            SETTINGS.JWT_ACCESS_TOKEN_EXPIRATION_IN_HOURS
        );

        const refreshToken = this.jwtService.createJwtToken<'refresh'>(
            { deviceId, userId },
            SETTINGS.JWT_REFRESH_TOKEN_EXPIRATION_IN_HOURS
        );

        return { accessToken, refreshToken };
    }
}
