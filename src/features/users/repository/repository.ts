import { ObjectId, WithId } from 'mongodb';
import { usersCollection } from '../../../db';
import { RepositoryNotFoundError } from '../../../core/errors';
import { TUser } from '../domain/user';

export const usersRepository = {
    async findUserByLogin(login: string): Promise<WithId<TUser> | null> {
        return usersCollection.findOne({ login });
    },

    async findUserByEmail(email: string): Promise<WithId<TUser> | null> {
        return usersCollection.findOne({ email });
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<TUser> | null> {
        return usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
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
