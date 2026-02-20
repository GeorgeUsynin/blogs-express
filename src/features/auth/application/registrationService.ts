import { inject, injectable } from 'inversify';
import { InvalidConfirmationCode } from '../../../core/errors';
import { EmailManager } from '../../../shared/managers/emailManager';
import { CreateUserInputModel } from '../../users/api/models';
import { UsersService } from '../../users/application/service';
import { UsersRepository } from '../../users/repository/repository';

@injectable()
export class RegistrationService {
    constructor(
        @inject(UsersService)
        private usersService: UsersService,
        @inject(UsersRepository)
        private usersRepository: UsersRepository,
        @inject(EmailManager)
        private emailManager: EmailManager
    ) {}

    async registerNewUser(userAttributes: CreateUserInputModel): Promise<void> {
        const {
            email,
            emailConfirmation: { confirmationCode },
        } = await this.usersService.create(userAttributes);

        this.emailManager.sendConfirmationEmail(email, confirmationCode);
    }

    async confirmRegistration(code: string): Promise<void> {
        const user = await this.usersRepository.findUserByConfirmationCode(code);

        if (!user) {
            throw new InvalidConfirmationCode();
        }

        user.confirmUserEmail(code);
        await this.usersRepository.save(user);
    }

    async resendEmailConfirmationCode(email: string): Promise<void> {
        const user = await this.usersRepository.findUserByEmail(email);

        if (user) {
            const confirmationCode = user.regenerateEmailConfirmationCode();
            await this.usersRepository.save(user);

            this.emailManager.sendConfirmationEmail(email, confirmationCode);
        }
    }
}
