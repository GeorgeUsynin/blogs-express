import { inject, injectable } from 'inversify';
import { EmailManager } from '../../../shared/managers/emailManager';
import { UsersService } from '../../users/application/service';
import { UsersRepository } from '../../users/repository/repository';
import { NewPasswordInputModel, PasswordRecoveryInputModel } from '../api/models';
import { BadRequestError } from '../../../core/errors';
import { PasswordHasher } from './passwordHasher';

@injectable()
export class PasswordRecoveryService {
    constructor(
        @inject(UsersService)
        private usersService: UsersService,
        @inject(UsersRepository)
        private usersRepository: UsersRepository,
        @inject(PasswordHasher)
        private passwordHasher: PasswordHasher,
        @inject(EmailManager)
        private emailManager: EmailManager
    ) {}

    async recoverPassword(recoverPasswordAttributes: PasswordRecoveryInputModel): Promise<void> {
        const { email } = recoverPasswordAttributes;
        const user = await this.usersRepository.findUserByEmail(email);
        const userId = user?._id.toString();

        if (userId) {
            const recoveryCode = await this.usersService.createAndUpdatePasswordRecoveryCode(userId);

            this.emailManager.sendPasswordRecoveryEmail(email, recoveryCode);

            return;
        }
    }

    async updateNewPassword(newPasswordAttributes: NewPasswordInputModel): Promise<void> {
        const { newPassword, recoveryCode } = newPasswordAttributes;

        const user = await this.usersRepository.findUserByPasswordRecoveryCode(recoveryCode);

        if (!user) {
            throw new BadRequestError('Invalid recovery code', 'recoveryCode');
        }

        const isRecoveryCodeExpired = Date.parse(user.passwordRecovery.expirationDate!) < Date.now();

        if (isRecoveryCodeExpired) {
            throw new BadRequestError('Password recovery code is expired', 'recoveryCode');
        }

        const passwordHash = await this.passwordHasher.hashPassword(newPassword);

        const passwordAttributes = {
            userId: user._id.toString(),
            newPasswordHash: passwordHash,
            recoveryCode: null,
            expirationDate: null,
        };

        await this.usersRepository.updatePasswordAttributes(passwordAttributes);

        return;
    }
}
