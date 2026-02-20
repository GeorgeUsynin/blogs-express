import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { PostModel, TPost } from '../domain';
import { PostQueryInput } from '../api/models';

type FindPostsFilter = Partial<Pick<TPost, 'blogId'>>;

@injectable()
export class PostsQueryRepository {
    async findMany(queryDto: PostQueryInput): Promise<{ items: WithId<TPost>[]; totalCount: number }> {
        return this.findManyWithFilter(queryDto);
    }

    async findManyByBlogId(
        blogId: string,
        queryDto: PostQueryInput
    ): Promise<{ items: WithId<TPost>[]; totalCount: number }> {
        return this.findManyWithFilter(queryDto, { blogId });
    }

    async findManyWithFilter(
        queryDto: PostQueryInput,
        filter: FindPostsFilter = {}
    ): Promise<{ items: WithId<TPost>[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize } = queryDto;
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            PostModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .lean()
                .exec(),
            PostModel.countDocuments(filter).exec(),
        ]);

        return { items, totalCount };
    }

    async findById(id: string): Promise<WithId<TPost> | null> {
        return PostModel.findById(id);
    }
}
