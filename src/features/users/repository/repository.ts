import { injectable } from 'inversify';
import { TUser, UserDocument, UserModel } from '../domain';
import { WithId } from 'mongodb';

@injectable()
export class UsersRepository {
    async findUserByLogin(login: string): Promise<UserDocument | null> {
        return UserModel.findOne({ login });
    }

    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return UserModel.findOne({ email });
    }

    async findUserByConfirmationCode(code: string): Promise<UserDocument | null> {
        return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
    }

    async findUserByPasswordRecoveryCode(code: string): Promise<UserDocument | null> {
        return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
        return UserModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
    }

    async findById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id);
    }

    async save(user: UserDocument): Promise<WithId<TUser>> {
        return user.save();
    }
}
