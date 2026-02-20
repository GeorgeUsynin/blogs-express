import { randomUUID } from 'crypto';
import { inject, injectable } from 'inversify';
import { UnauthorizedError } from '../../../core/errors';
import { SETTINGS } from '../../../core/settings';
import { DevicesService } from '../../devices/application/service';
import { DevicesRepository } from '../../devices/repository/repository';
import { UsersRepository } from '../../users/repository/repository';
import { CreateLoginDto } from './dto';
import { JwtProvider } from './jwtProvider';
import { PasswordHasher } from './passwordHasher';

@injectable()
export class AuthService {
    constructor(
        @inject(UsersRepository)
        private usersRepository: UsersRepository,
        @inject(PasswordHasher)
        private passwordHasher: PasswordHasher,
        @inject(JwtProvider)
        private jwtProvider: JwtProvider,
        @inject(DevicesService)
        private devicesService: DevicesService,
        @inject(DevicesRepository)
        private devicesRepository: DevicesRepository
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

        const isValidPassword = await this.passwordHasher.comparePassword(password, user.passwordHash);

        if (!isValidPassword) {
            throw new UnauthorizedError();
        }

        if (!user.emailConfirmation.isConfirmed) {
            throw new UnauthorizedError('Email address is not confirmed', 'EMAIL_NOT_CONFIRMED');
        }

        const uniqueDeviceId = randomUUID();

        const { accessToken, refreshToken } = this._generateTokens(user._id.toString(), uniqueDeviceId);

        const { iat, exp } = this.jwtProvider.verifyToken<'refresh'>(refreshToken);
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

        const { iat, exp } = this.jwtProvider.verifyToken<'refresh'>(refreshToken);
        const issuedAt = new Date(iat! * 1000).toISOString();
        const expiresIn = new Date(exp! * 1000).toISOString();

        const device = await this.devicesRepository.findByDeviceId(deviceId);

        if (!device) {
            throw new UnauthorizedError();
        }

        device.issuedAt = issuedAt;
        device.expiresIn = expiresIn;

        await this.devicesRepository.save(device);

        return { accessToken, refreshToken };
    }

    _generateTokens(userId: string, deviceId: string) {
        const accessToken = this.jwtProvider.createJwtToken<'access'>(
            { userId },
            SETTINGS.JWT_ACCESS_TOKEN_EXPIRATION_IN_HOURS
        );

        const refreshToken = this.jwtProvider.createJwtToken<'refresh'>(
            { deviceId, userId },
            SETTINGS.JWT_REFRESH_TOKEN_EXPIRATION_IN_HOURS
        );

        return { accessToken, refreshToken };
    }
}
