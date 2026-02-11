import { BadRequestError } from '../../../core/errors';
import { passwordService } from '../../auth/application';
import { CreateUserInputModel } from '../api/models';
import { TUser } from '../domain/user';
import { usersRepository } from '../repository';

export const usersService = {
    async create(userAttributes: CreateUserInputModel): Promise<string> {
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
            createdAt: new Date().toISOString(),
        };

        return usersRepository.create(user);
    },

    async removeById(id: string): Promise<void> {
        await usersRepository.removeById(id);

        return;
    },
};
