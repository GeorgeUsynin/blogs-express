import { BadRequestError } from '../../../core/errors';
import { emailManager } from '../../../shared/managers/emailManager';
import { CreateUserInputModel } from '../../users/api/models';
import { usersService } from '../../users/application';
import { usersRepository } from '../../users/repository';
import { RegistrationConfirmationInputModel, RegistrationEmailResendingInputModel } from '../api/models';

export const registrationService = {
    async registerNewUser(userAttributes: CreateUserInputModel): Promise<void> {
        const createdUserId = await usersService.create(userAttributes);

        const user = await usersRepository.findByIdOrFail(createdUserId);

        emailManager.sendConfirmationEmail(user.email, user.emailConfirmation.confirmationCode);

        return;
    },

    async confirmRegistration(confirmationAttributes: RegistrationConfirmationInputModel): Promise<void> {
        const user = await usersRepository.findUserByConfirmationCode(confirmationAttributes.code);

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

        await usersRepository.setEmailConfirmed(user._id.toString());

        return;
    },

    async resendEmailConfirmationCode(
        resendingConfirmationEmailAttributes: RegistrationEmailResendingInputModel
    ): Promise<void> {
        const user = await usersRepository.findUserByEmail(resendingConfirmationEmailAttributes.email);

        if (!user) {
            throw new BadRequestError('Invalid email', 'email');
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new BadRequestError('Confirmation code already been applied', 'code');
        }

        const confirmationCode = await usersService.createAndUpdateEmailConfirmationCode(user._id.toString());

        emailManager.sendConfirmationEmail(resendingConfirmationEmailAttributes.email, confirmationCode);

        return;
    },
};
