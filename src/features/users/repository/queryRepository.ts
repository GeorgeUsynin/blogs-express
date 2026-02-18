import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { UserQueryInput } from '../api/models';
import { TUser, UserModel } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

@injectable()
export class UsersQueryRepository {
    async findMany(queryDto: UserQueryInput): Promise<{ items: WithId<TUser>[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize, searchEmailTerm, searchLoginTerm } = queryDto;
        const skip = (pageNumber - 1) * pageSize;

        const emailRegex = searchEmailTerm ? new RegExp(searchEmailTerm, 'i') : null;
        const loginRegex = searchLoginTerm ? new RegExp(searchLoginTerm, 'i') : null;

        const filter: Record<string, unknown> = {};
        if (emailRegex && loginRegex) {
            filter.$or = [{ email: emailRegex }, { login: loginRegex }];
        } else if (emailRegex) {
            filter.email = emailRegex;
        } else if (loginRegex) {
            filter.login = loginRegex;
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

    async findByIdOrFail(id: string): Promise<WithId<TUser>> {
        const res = await UserModel.findById(id);

        if (!res) {
            throw new RepositoryNotFoundError("User doesn't exist");
        }
        return res;
    }
}
