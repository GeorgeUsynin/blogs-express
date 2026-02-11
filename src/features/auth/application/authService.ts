import { UnauthorizedError } from '../../../core/errors';
import { usersRepository } from '../../users/repository';
import { CreateLoginInputModel } from '../api/models';
import { passwordService } from './passwordService';

export const authService = {
    async login(loginAttributes: CreateLoginInputModel): Promise<void> {
        const { loginOrEmail, password } = loginAttributes;

        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw new UnauthorizedError();
        }

        const isValidPassword = await passwordService.comparePassword(password, user.passwordHash);

        if (!isValidPassword) {
            throw new UnauthorizedError();
        }

        return;
    },
};
