import { ObjectId, WithId } from 'mongodb';
import { injectable } from 'inversify';
import { RepositoryNotFoundError } from '../../../core/errors';
import { TPost } from '../domain';
import { PostQueryInput } from '../api/models';
import { postsCollection } from '../../../db';

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

        const items = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments(filter);

        return { items, totalCount };
    }

    async findByIdOrFail(id: string): Promise<WithId<TPost>> {
        const res = await postsCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("Post doesn't exist");
        }
        return res;
    }
}
