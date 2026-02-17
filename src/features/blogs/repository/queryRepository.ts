import { ObjectId, WithId } from 'mongodb';
import { injectable } from 'inversify';
import { blogsCollection } from '../../../db';
import { BlogQueryInput } from '../api/models';
import { TBlog } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

@injectable()
export class BlogsQueryRepository {
    async findMany(queryDto: BlogQueryInput): Promise<{ items: WithId<TBlog>[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize, searchNameTerm } = queryDto;

        const skip = (pageNumber - 1) * pageSize;

        const filter: any = {};

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        const items = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await blogsCollection.countDocuments(filter);

        return { items, totalCount };
    }

    async findByIdOrFail(id: string): Promise<WithId<TBlog>> {
        const res = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("Blog doesn't exist");
        }
        return res;
    }
}
