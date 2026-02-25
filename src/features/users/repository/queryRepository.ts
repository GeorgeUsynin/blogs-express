import { ObjectId, WithId } from 'mongodb';
import { injectable } from 'inversify';
import { UserQueryInput } from '../api/models';
import { TUser, UserModel } from '../domain';
import { QueryFilter } from 'mongoose';

@injectable()
export class UsersQueryRepository {
    async findMany(queryDto: UserQueryInput): Promise<{ items: WithId<TUser>[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize, searchEmailTerm, searchLoginTerm } = queryDto;
        const skip = (pageNumber - 1) * pageSize;

        const filter: QueryFilter<TUser> = {};

        if (searchLoginTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: searchLoginTerm, $options: 'i' },
            });
        }

        if (searchEmailTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                email: { $regex: searchEmailTerm, $options: 'i' },
            });
        }

        const [items, totalCount] = await Promise.all([
            UserModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .lean()
                .exec(),
            UserModel.countDocuments(filter).exec(),
        ]);

        return { items, totalCount };
    }

    async findUsersByUserIds(userIds: string[]): Promise<WithId<TUser>[]> {
        return UserModel.find({
            _id: {
                $in: userIds.map(id => new ObjectId(id)),
            },
        })
            .lean()
            .exec();
    }

    async findById(id: string): Promise<WithId<TUser> | null> {
        return UserModel.findById(id).lean().exec();
    }
}
