import { ObjectId } from 'mongodb';
import { postsCollection } from '../../../db';
import { CreateUpdatePostInputModel } from '../api/models';
import { type TPost } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

export const postsRepository = {
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
