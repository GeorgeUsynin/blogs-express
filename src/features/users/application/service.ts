import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { BadRequestError } from '../../../core/errors';
import { passwordService } from '../../auth/application';
import { CreateUserInputModel } from '../api/models';
import { TUser } from '../domain';
import { usersRepository } from '../repository';
import { SETTINGS } from '../../../core/settings';

export const usersService = {
    async create(userAttributes: CreateUserInputModel, isConfirmed: boolean = false): Promise<string> {
        const { email, login, password } = userAttributes;

        const userWithExistedLogin = await usersRepository.findUserByLogin(login);
        if (userWithExistedLogin) {
            throw new BadRequestError('The login is not unique', 'login');
        }

        const userWithExistedEmail = await usersRepository.findUserByEmail(email);
        if (userWithExistedEmail) {
            throw new BadRequestError('The email address is not unique', 'email');
        }

        const passwordHash = await passwordService.hashPassword(password);

        const user: TUser = {
            email,
            login,
            passwordHash,
            emailConfirmation: {
                confirmationCode: this._generateConfirmationCode(),
                expirationDate: this._generateExpirationDate(),
                isConfirmed,
            },
            createdAt: new Date().toISOString(),
        };

        return usersRepository.create(user);
    },

    async removeById(id: string): Promise<void> {
        await usersRepository.removeById(id);

        return;
    },

    async createAndUpdateEmailConfirmationCode(userId: string): Promise<string> {
        const confirmationCode = this._generateConfirmationCode();
        const expirationDate = this._generateExpirationDate();

        await usersRepository.updateEmailConfirmationAttributes(userId, confirmationCode, expirationDate);

        return confirmationCode;
    },

    _generateConfirmationCode(): string {
        return randomUUID();
    },

    _generateExpirationDate(): string {
        return add(new Date(), {
            hours: SETTINGS.EXPIRATION_DATES.REGISTRATION_CODE_HOURS,
        }).toISOString();
    },
};
