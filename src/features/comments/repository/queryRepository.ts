import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../../core/errors';
import { TComment } from '../domain';
import { CommentQueryInput } from '../api/models';
import { commentsCollection } from '../../../db';

export const commentsQueryRepository = {
    async findMany(queryDto: CommentQueryInput): Promise<{ items: WithId<TComment>[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize } = queryDto;

        const skip = (pageNumber - 1) * pageSize;

        const items = await commentsCollection
            .find()
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await commentsCollection.countDocuments();

        return { items, totalCount };
    },

    async findByIdOrFail(id: string): Promise<WithId<TComment>> {
        const res = await commentsCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("Comment doesn't exist");
        }
        return res;
    },
};
