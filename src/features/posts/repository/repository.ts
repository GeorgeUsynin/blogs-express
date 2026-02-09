import { ObjectId, WithId } from 'mongodb';
import { postsCollection, TPost } from '../../../db';
import { CreateUpdatePostInputModel } from '../models';

export const postsRepository = {
    async findAll(): Promise<WithId<TPost>[]> {
        return postsCollection.find().toArray();
    },

    async findById(_id: ObjectId): Promise<WithId<TPost> | null> {
        return postsCollection.findOne({ _id });
    },

    async create(blogName: string, postPayload: CreateUpdatePostInputModel): Promise<WithId<TPost>> {
        const post: TPost = {
            blogName,
            createdAt: new Date().toISOString(),
            ...postPayload,
        };

        const { insertedId } = await postsCollection.insertOne(post);

        return { ...post, _id: insertedId };
    },

    async updateById(_id: ObjectId, postPayload: CreateUpdatePostInputModel): Promise<void> {
        const { matchedCount } = await postsCollection.updateOne(
            { _id },
            {
                $set: {
                    title: postPayload.title,
                    shortDescription: postPayload.shortDescription,
                    content: postPayload.content,
                    blogId: postPayload.blogId,
                },
            }
        );

        if (matchedCount < 1) {
            throw new Error("Post doesn't exist");
        }
    },

    async removeById(_id: ObjectId): Promise<void> {
        const { deletedCount } = await postsCollection.deleteOne({ _id });

        if (deletedCount < 1) {
            throw new Error("Post doesn't exist");
        }
    },
};
