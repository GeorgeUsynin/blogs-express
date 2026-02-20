import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { BlogQueryInput } from '../api/models';
import { BlogModel, TBlog } from '../domain';

@injectable()
export class BlogsQueryRepository {
    async findMany(queryDto: BlogQueryInput): Promise<{ items: WithId<TBlog>[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize, searchNameTerm } = queryDto;
        const skip = (pageNumber - 1) * pageSize;

        const nameRegex = searchNameTerm ? new RegExp(searchNameTerm, 'i') : null;

        const filter: Record<string, unknown> = {};

        if (nameRegex) {
            filter.name = nameRegex;
        }

        const [items, totalCount] = await Promise.all([
            BlogModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .lean()
                .exec(),
            BlogModel.countDocuments(filter).exec(),
        ]);

        return { items, totalCount };
    }

    async findById(id: string): Promise<WithId<TBlog> | null> {
        return BlogModel.findById(id);
    }
}
