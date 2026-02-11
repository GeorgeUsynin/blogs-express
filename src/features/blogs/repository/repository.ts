import { ObjectId, WithId } from 'mongodb';
import { blogsCollection } from '../../../db';
import { BlogQueryInput, CreateUpdateBlogInputModel } from '../api/models';
import { TBlog } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

export const blogsRepository = {
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
    },

    async findByIdOrFail(id: string): Promise<WithId<TBlog>> {
        const res = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("Blog doesn't exist");
        }
        return res;
    },

    async create(blog: TBlog): Promise<string> {
        const { insertedId } = await blogsCollection.insertOne(blog);

        return insertedId.toString();
    },

    async updateById(id: string, dto: CreateUpdateBlogInputModel): Promise<void> {
        const { matchedCount } = await blogsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name: dto.name,
                    description: dto.description,
                    websiteUrl: dto.websiteUrl,
                },
            }
        );

        if (matchedCount < 1) {
            throw new RepositoryNotFoundError("Blog doesn't exist");
        }

        return;
    },

    async removeById(id: string): Promise<void> {
        const { deletedCount } = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

        if (deletedCount < 1) {
            throw new RepositoryNotFoundError("Blog doesn't exist");
        }

        return;
    },
};
