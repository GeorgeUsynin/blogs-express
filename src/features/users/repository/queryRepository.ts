import { ObjectId, WithId } from 'mongodb';
import { injectable } from 'inversify';
import { UserQueryInput } from '../api/models';
import { TUser } from '../domain';
import { usersCollection } from '../../../db';
import { RepositoryNotFoundError } from '../../../core/errors';

@injectable()
export class UsersQueryRepository {
    async findMany(queryDto: UserQueryInput): Promise<{ items: WithId<TUser>[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize, searchEmailTerm, searchLoginTerm } = queryDto;

        const skip = (pageNumber - 1) * pageSize;

        let filter: any = {};

        if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: 'i' };
        }

        if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: 'i' };
        }

        if (searchEmailTerm && searchLoginTerm) {
            filter = {
                $or: [
                    { email: { $regex: searchEmailTerm, $options: 'i' } },
                    { login: { $regex: searchLoginTerm, $options: 'i' } },
                ],
            };
        }

        const items = await usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await usersCollection.countDocuments(filter);

        return { items, totalCount };
    }

    async findByIdOrFail(id: string): Promise<WithId<TUser>> {
        const res = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("User doesn't exist");
        }
        return res;
    }
}
