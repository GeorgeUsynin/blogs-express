import { ObjectId, WithId } from 'mongodb';
import { blogsCollection } from '../../../db';
import { CreateUpdateBlogInputModel } from '../api/models';
import { TBlog } from '../domain';

export const blogsRepository = {
    async findAll(): Promise<WithId<TBlog>[]> {
        return blogsCollection.find().toArray();
    },

    async findById(_id: ObjectId): Promise<WithId<TBlog> | null> {
        return blogsCollection.findOne({ _id });
    },

    async create(blogPayload: CreateUpdateBlogInputModel): Promise<WithId<TBlog>> {
        const blog: TBlog = {
            isMembership: false,
            createdAt: new Date().toISOString(),
            ...blogPayload,
        };

        const { insertedId } = await blogsCollection.insertOne(blog);

        return { ...blog, _id: insertedId };
    },

    async updateById(_id: ObjectId, blogPayload: CreateUpdateBlogInputModel): Promise<void> {
        const { matchedCount } = await blogsCollection.updateOne(
            { _id },
            {
                $set: {
                    name: blogPayload.name,
                    description: blogPayload.description,
                    websiteUrl: blogPayload.websiteUrl,
                },
            }
        );

        if (matchedCount < 1) {
            throw new Error("Blog doesn't exist");
        }
    },

    async removeById(_id: ObjectId): Promise<void> {
        const { deletedCount } = await blogsCollection.deleteOne({ _id });

        if (deletedCount < 1) {
            throw new Error("Blog doesn't exist");
        }
    },
};
