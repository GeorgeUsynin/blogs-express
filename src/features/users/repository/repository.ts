import { injectable } from 'inversify';
import { RepositoryNotFoundError } from '../../../core/errors';
import { UserDocument, UserModel } from '../domain';

@injectable()
export class UsersRepository {
    async findUserByLogin(login: string) {
        return UserModel.findOne({ login });
    }

    async findUserByEmail(email: string) {
        return UserModel.findOne({ email });
    }

    async findUserByConfirmationCode(code: string) {
        return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
    }

    async findUserByPasswordRecoveryCode(code: string) {
        return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
    }

    async findUserByLoginOrEmail(loginOrEmail: string) {
        return UserModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
    }

    async findByIdOrFail(id: string) {
        const res = await UserModel.findById(id);

        if (!res) {
            throw new RepositoryNotFoundError("User doesn't exist");
        }

        return res;
    }

    async save(user: UserDocument): Promise<string> {
        const { _id } = await user.save();

        return _id.toString();
    }
}
