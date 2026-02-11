import { ObjectId, WithId } from 'mongodb';
import { postsCollection } from '../../../db';
import { CreateUpdatePostInputModel, PostQueryInput } from '../api/models';
import { type TPost } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

export const postsRepository = {
    async findMany(queryDto: PostQueryInput): Promise<{ items: WithId<TPost>[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize } = queryDto;

        const skip = (pageNumber - 1) * pageSize;

        const filter: any = {};

        const items = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments(filter);

        return { items, totalCount };
    },

    async findByIdOrFail(id: string): Promise<WithId<TPost>> {
        const res = await postsCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError('Post not exist');
        }
        return res;
    },

    async create(post: TPost): Promise<string> {
        const { insertedId } = await postsCollection.insertOne(post);

        return insertedId.toString();
    },

    async updateById(id: string, dto: CreateUpdatePostInputModel): Promise<void> {
        const { matchedCount } = await postsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                },
            }
        );

        if (matchedCount < 1) {
            throw new RepositoryNotFoundError("Post doesn't exist");
        }

        return;
    },

    async removeById(id: string): Promise<void> {
        const { deletedCount } = await postsCollection.deleteOne({ _id: new ObjectId(id) });

        if (deletedCount < 1) {
            throw new RepositoryNotFoundError("Post doesn't exist");
        }

        return;
    },
};
