import { inject, injectable } from 'inversify';
import { BadRequestError } from '../../../core/errors';
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
        const createdUserId = await this.usersService.create(userAttributes);

        const user = await this.usersRepository.findByIdOrFail(createdUserId);

        this.emailManager.sendConfirmationEmail(user.email, user.emailConfirmation.confirmationCode);

        return;
    }

    async confirmRegistration(code: string): Promise<void> {
        const user = await this.usersRepository.findUserByConfirmationCode(code);

        if (!user) {
            throw new BadRequestError('Invalid confirmation code', 'code');
        }

        user.confirmUserEmail(code);
        await this.usersRepository.save(user);

        return;
    }

    async resendEmailConfirmationCode(email: string): Promise<void> {
        const user = await this.usersRepository.findUserByEmail(email);

        if (!user) {
            throw new BadRequestError('Invalid email', 'email');
        }

        const confirmationCode = user.regenerateEmailConfirmationCode();
        await this.usersRepository.save(user);

        this.emailManager.sendConfirmationEmail(email, confirmationCode);

        return;
    }
}
