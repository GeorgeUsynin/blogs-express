import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { inject, injectable } from 'inversify';
import { BadRequestError } from '../../../core/errors';
import { PasswordService } from '../../auth/application/passwordService';
import { CreateUserInputModel } from '../api/models';
import { TUser } from '../domain';
import { UsersRepository } from '../repository/repository';
import { SETTINGS } from '../../../core/settings';

@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository)
        public usersRepository: UsersRepository,
        @inject(PasswordService)
        public passwordService: PasswordService
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

        const passwordHash = await this.passwordService.hashPassword(password);

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

        return this.usersRepository.create(user);
    }

    async removeById(id: string): Promise<void> {
        await this.usersRepository.removeById(id);

        return;
    }

    async createAndUpdateEmailConfirmationCode(userId: string): Promise<string> {
        const confirmationCode = this._generateConfirmationCode();
        const expirationDate = this._generateExpirationDate();

        await this.usersRepository.updateEmailConfirmationAttributes(userId, confirmationCode, expirationDate);

        return confirmationCode;
    }

    _generateConfirmationCode(): string {
        return randomUUID();
    }

    _generateExpirationDate(): string {
        return add(new Date(), {
            hours: SETTINGS.EXPIRATION_DATES.REGISTRATION_CODE_HOURS,
        }).toISOString();
    }
}
