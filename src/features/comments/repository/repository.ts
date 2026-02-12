import { ObjectId, WithId } from 'mongodb';
import { commentsCollection } from '../../../db';
import { CreateUpdateCommentInputModel } from '../api/models';
import { type TComment } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

export const commentsRepository = {
    async findByIdOrFail(id: string): Promise<WithId<TComment>> {
        const res = await commentsCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("Comment doesn't exist");
        }
        return res;
    },

    async create(comment: TComment): Promise<string> {
        const { insertedId } = await commentsCollection.insertOne(comment);

        return insertedId.toString();
    },

    async updateById(id: string, dto: CreateUpdateCommentInputModel): Promise<void> {
        const { matchedCount } = await commentsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    content: dto.content,
                },
            }
        );

        if (matchedCount < 1) {
            throw new RepositoryNotFoundError("Comment doesn't exist");
        }

        return;
    },

    async removeById(id: string): Promise<void> {
        const { deletedCount } = await commentsCollection.deleteOne({ _id: new ObjectId(id) });

        if (deletedCount < 1) {
            throw new RepositoryNotFoundError("Comment doesn't exist");
        }

        return;
    },
};
