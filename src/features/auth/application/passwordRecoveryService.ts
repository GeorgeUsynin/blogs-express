import { inject, injectable } from 'inversify';
import { EmailManager } from '../../../shared/managers/emailManager';
import { UsersRepository } from '../../users/repository/repository';
import { BadRequestError } from '../../../core/errors';
import { PasswordHasher } from './passwordHasher';

@injectable()
export class PasswordRecoveryService {
    constructor(
        @inject(UsersRepository)
        private usersRepository: UsersRepository,
        @inject(PasswordHasher)
        private passwordHasher: PasswordHasher,
        @inject(EmailManager)
        private emailManager: EmailManager
    ) {}

    async recoverPassword(email: string): Promise<void> {
        const user = await this.usersRepository.findUserByEmail(email);

        if (user) {
            const recoveryCode = user.createAndUpdatePasswordRecoveryCode();
            await this.usersRepository.save(user);

            this.emailManager.sendPasswordRecoveryEmail(email, recoveryCode);

            return;
        }
    }

    async updateNewPassword(newPassword: string, recoveryCode: string): Promise<void> {
        const user = await this.usersRepository.findUserByPasswordRecoveryCode(recoveryCode);

        if (!user) {
            throw new BadRequestError('Invalid recovery code', 'recoveryCode');
        }

        const passwordHash = await this.passwordHasher.hashPassword(newPassword);

        user.updatePasswordByRecoveryCode(recoveryCode, passwordHash);
        await this.usersRepository.save(user);

        return;
    }
}
