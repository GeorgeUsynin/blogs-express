import { ObjectId, WithId } from 'mongodb';
import { usersCollection } from '../../../db';
import { RepositoryNotFoundError } from '../../../core/errors';
import { TUser } from '../domain';

export const usersRepository = {
    async findUserByLogin(login: string): Promise<WithId<TUser> | null> {
        return usersCollection.findOne({ login });
    },

    async findUserByEmail(email: string): Promise<WithId<TUser> | null> {
        return usersCollection.findOne({ email });
    },

    async findUserByConfirmationCode(code: string): Promise<WithId<TUser> | null> {
        return usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<TUser> | null> {
        return usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
    },

    async findByIdOrFail(id: string): Promise<WithId<TUser>> {
        const res = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("User doesn't exist");
        }
        return res;
    },

    async setEmailConfirmed(id: string): Promise<void> {
        const { matchedCount } = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    'emailConfirmation.isConfirmed': true,
                },
            }
        );

        if (matchedCount < 1) {
            throw new RepositoryNotFoundError("User doesn't exist");
        }

        return;
    },

    async updateEmailConfirmationAttributes(
        userId: string,
        confirmationCode: string,
        expirationDate: string
    ): Promise<void> {
        const { matchedCount } = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    'emailConfirmation.confirmationCode': confirmationCode,
                    'emailConfirmation.expirationDate': expirationDate,
                },
            }
        );

        if (matchedCount < 1) {
            throw new RepositoryNotFoundError("User doesn't exist");
        }

        return;
    },

    async create(user: TUser): Promise<string> {
        const { insertedId } = await usersCollection.insertOne(user);

        return insertedId.toString();
    },

    async removeById(id: string): Promise<void> {
        const { deletedCount } = await usersCollection.deleteOne({ _id: new ObjectId(id) });

        if (deletedCount < 1) {
            throw new RepositoryNotFoundError("User doesn't exist");
        }

        return;
    },
};
