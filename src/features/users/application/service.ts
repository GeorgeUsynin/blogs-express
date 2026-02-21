import { inject, injectable } from 'inversify';
import { PasswordHasher } from '../../auth/application/passwordHasher';
import { CreateUserInputModel } from '../api/models';
import { UsersRepository } from '../repository';
import { UserModel } from '../domain';
import { EmailAlreadyExistsError, LoginAlreadyExistsError, UserNotFoundError } from '../../../core/errors';

@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository)
        private usersRepository: UsersRepository,
        @inject(PasswordHasher)
        private passwordHasher: PasswordHasher
    ) {}

    async create(userAttributes: CreateUserInputModel, isConfirmed = false): Promise<string> {
        const { email, login, password } = userAttributes;

        const userWithExistedLogin = await this.usersRepository.findUserByLogin(login);
        if (userWithExistedLogin) {
            throw new LoginAlreadyExistsError();
        }

        const userWithExistedEmail = await this.usersRepository.findUserByEmail(email);
        if (userWithExistedEmail) {
            throw new EmailAlreadyExistsError();
        }

        const passwordHash = await this.passwordHasher.hashPassword(password);

        let newUser;

        if (isConfirmed) {
            newUser = UserModel.createConfirmedUser({ email, login, passwordHash });
        } else {
            newUser = UserModel.createUnconfirmedUser({ email, login, passwordHash });
        }

        return this.usersRepository.save(newUser);
    }

    async removeById(id: string): Promise<void> {
        const foundUser = await this.usersRepository.findById(id);

        if (!foundUser) {
            throw new UserNotFoundError();
        }

        foundUser.isDeleted = true;

        await this.usersRepository.save(foundUser);
    }
}
