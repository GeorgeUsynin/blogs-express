import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { inject, injectable } from 'inversify';
import { BadRequestError } from '../../../core/errors';
import { PasswordHasher } from '../../auth/application/passwordHasher';
import { CreateUserInputModel } from '../api/models';
import { TUser } from '../domain';
import { UsersRepository } from '../repository/repository';
import { SETTINGS } from '../../../core/settings';

@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository)
        private usersRepository: UsersRepository,
        @inject(PasswordHasher)
        private passwordHasher: PasswordHasher
    ) {}

    async create(userAttributes: CreateUserInputModel, isConfirmed: boolean = false): Promise<string> {
        const { email, login, password } = userAttributes;

        const userWithExistedLogin = await this.usersRepository.findUserByLogin(login);
        if (userWithExistedLogin) {
            throw new BadRequestError('The login is not unique', 'login');
        }

        const userWithExistedEmail = await this.usersRepository.findUserByEmail(email);
        if (userWithExistedEmail) {
            throw new BadRequestError('The email address is not unique', 'email');
        }

        const passwordHash = await this.passwordHasher.hashPassword(password);

        const user: TUser = {
            email,
            login,
            passwordHash,
            emailConfirmation: {
                confirmationCode: this._generateUUIDCode(),
                expirationDate: this._generateExpirationDate(),
                isConfirmed,
            },
            passwordRecovery: {
                recoveryCode: null,
                expirationDate: null,
            },
            createdAt: new Date().toISOString(),
        };

        return this.usersRepository.create(user);
    }

    async removeById(id: string): Promise<void> {
        await this.usersRepository.removeById(id);

        return;
    }

    async createAndUpdateEmailConfirmationCode(userId: string): Promise<string> {
        const confirmationCode = this._generateUUIDCode();
        const expirationDate = this._generateExpirationDate();

        await this.usersRepository.updateEmailConfirmationAttributes(userId, confirmationCode, expirationDate);

        return confirmationCode;
    }

    async createAndUpdatePasswordRecoveryCode(userId: string): Promise<string> {
        const recoveryCode = this._generateUUIDCode();
        const expirationDate = this._generateExpirationDate();

        await this.usersRepository.updatePasswordRecoveryAttributes(userId, recoveryCode, expirationDate);

        return recoveryCode;
    }

    _generateUUIDCode(): string {
        return randomUUID();
    }

    _generateExpirationDate(): string {
        return add(new Date(), {
            hours: SETTINGS.EXPIRATION_DATES.REGISTRATION_CODE_HOURS,
        }).toISOString();
    }
}
