import { randomUUID } from 'crypto';
import { UnauthorizedError } from '../../../core/errors';
import { SETTINGS } from '../../../core/settings';
import { devicesService } from '../../devices/application';
import { devicesRepository } from '../../devices/repository';
import { usersRepository } from '../../users/repository';
import { CreateLoginDto } from './dto';
import { jwtService } from './jwtService';
import { passwordService } from './passwordService';

export const authService = {
    async login(loginAttributes: CreateLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const { loginOrEmail, password, clientIp, deviceName } = loginAttributes;

        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw new UnauthorizedError();
        }

        const isValidPassword = await passwordService.comparePassword(password, user.passwordHash);

        if (!isValidPassword) {
            throw new UnauthorizedError();
        }

        if (!user.emailConfirmation.isConfirmed) {
            throw new UnauthorizedError('Email address is not confirmed', 'EMAIL_NOT_CONFIRMED');
        }

        const uniqueDeviceId = randomUUID();

        const { accessToken, refreshToken } = this._generateTokens(user._id.toString(), uniqueDeviceId);

        const { iat, exp } = jwtService.verifyToken(refreshToken);
        const issuedAt = new Date(iat! * 1000).toISOString();
        const expiresIn = new Date(exp! * 1000).toISOString();

        await devicesService.create({
            userId: user._id.toString(),
            deviceId: uniqueDeviceId,
            clientIp,
            deviceName,
            issuedAt,
            expiresIn,
        });

        return { accessToken, refreshToken };
    },

    async logout(deviceId: string): Promise<void> {
        await devicesRepository.removeByDeviceId(deviceId);

        return;
    },

    async updateTokens(
        userId: string,
        deviceId: string
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const { accessToken, refreshToken } = this._generateTokens(userId, deviceId);

        const { iat, exp } = jwtService.verifyToken(refreshToken);
        const issuedAt = new Date(iat! * 1000).toISOString();
        const expiresIn = new Date(exp! * 1000).toISOString();
        const payload = { issuedAt, expiresIn };

        await devicesRepository.updateByDeviceId(deviceId, payload);

        return { accessToken, refreshToken };
    },

    _generateTokens(userId: string, deviceId: string) {
        const accessToken = jwtService.createJwtToken<'access'>(
            { userId },
            SETTINGS.JWT_ACCESS_TOKEN_EXPIRATION_IN_HOURS
        );

        const refreshToken = jwtService.createJwtToken<'refresh'>(
            { deviceId, userId },
            SETTINGS.JWT_REFRESH_TOKEN_EXPIRATION_IN_HOURS
        );

        return { accessToken, refreshToken };
    },
};
