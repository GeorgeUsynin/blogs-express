import { inject, injectable } from 'inversify';
import { BadRequestError } from '../../../core/errors';
import { EmailManager } from '../../../shared/managers/emailManager';
import { CreateUserInputModel } from '../../users/api/models';
import { UsersService } from '../../users/application/service';
import { UsersRepository } from '../../users/repository/repository';
import { RegistrationConfirmationInputModel, RegistrationEmailResendingInputModel } from '../api/models';

@injectable()
export class RegistrationService {
    constructor(
        @inject(UsersService)
        public usersService: UsersService,
        @inject(UsersRepository)
        public usersRepository: UsersRepository,
        @inject(EmailManager)
        public emailManager: EmailManager
    ) {}

    async registerNewUser(userAttributes: CreateUserInputModel): Promise<void> {
        const createdUserId = await this.usersService.create(userAttributes);

        const user = await this.usersRepository.findByIdOrFail(createdUserId);

        this.emailManager.sendConfirmationEmail(user.email, user.emailConfirmation.confirmationCode);

        return;
    }

    async confirmRegistration(confirmationAttributes: RegistrationConfirmationInputModel): Promise<void> {
        const user = await this.usersRepository.findUserByConfirmationCode(confirmationAttributes.code);

        if (!user) {
            throw new BadRequestError('Invalid confirmation code', 'code');
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new BadRequestError('Confirmation code already been applied', 'code');
        }

        const isConfirmationCodeExpired = Date.parse(user.emailConfirmation.expirationDate) < Date.now();

        if (isConfirmationCodeExpired) {
            throw new BadRequestError('Confirmation code is expired', 'code');
        }

        await this.usersRepository.setEmailConfirmed(user._id.toString());

        return;
    }

    async resendEmailConfirmationCode(
        resendingConfirmationEmailAttributes: RegistrationEmailResendingInputModel
    ): Promise<void> {
        const user = await this.usersRepository.findUserByEmail(resendingConfirmationEmailAttributes.email);

        if (!user) {
            throw new BadRequestError('Invalid email', 'email');
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new BadRequestError('Confirmation code already been applied', 'code');
        }

        const confirmationCode = await this.usersService.createAndUpdateEmailConfirmationCode(user._id.toString());

        this.emailManager.sendConfirmationEmail(resendingConfirmationEmailAttributes.email, confirmationCode);

        return;
    }
}
