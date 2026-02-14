import { UnauthorizedError } from '../../../core/errors';
import { SETTINGS } from '../../../core/settings';
import { devicesService } from '../../devices/application';
import { devicesRepository } from '../../devices/repository';
import { usersRepository } from '../../users/repository';
import { CreateLoginInputModel } from '../api/models';
import { UpdateTokensDto } from './dto';
import { jwtService } from './jwtService';
import { passwordService } from './passwordService';

export const authService = {
    async login(loginAttributes: CreateLoginInputModel): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const { loginOrEmail, password } = loginAttributes;

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

        const deviceId = await devicesService.create(user._id.toString());

        return this._generateTokens(user._id.toString(), deviceId);
    },

    async logout(deviceId: string, currentRefreshToken: string): Promise<void> {
        await devicesRepository.revokeRefreshToken(deviceId, currentRefreshToken);

        return;
    },

    async updateTokens(refreshSession: UpdateTokensDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const { deviceId, userId, refreshToken } = refreshSession;

        await devicesRepository.revokeRefreshToken(deviceId, refreshToken);

        return this._generateTokens(userId, deviceId);
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
