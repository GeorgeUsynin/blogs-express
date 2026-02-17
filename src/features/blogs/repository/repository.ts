import { ObjectId, WithId } from 'mongodb';
import { injectable } from 'inversify';
import { blogsCollection } from '../../../db';
import { CreateUpdateBlogInputModel } from '../api/models';
import { TBlog } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

@injectable()
export class BlogsRepository {
    async findByIdOrFail(id: string): Promise<WithId<TBlog>> {
        const res = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("Blog doesn't exist");
        }
        return res;
    }

    async create(blog: TBlog): Promise<string> {
        const { insertedId } = await blogsCollection.insertOne(blog);

        return insertedId.toString();
    }

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
    }

    async removeById(id: string): Promise<void> {
        const { deletedCount } = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

        if (deletedCount < 1) {
            throw new RepositoryNotFoundError("Blog doesn't exist");
        }

        return;
    }
}
