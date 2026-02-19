import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { BlogDocument, BlogModel, TBlog } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

@injectable()
export class BlogsRepository {
    async findByIdOrFail(id: string): Promise<BlogDocument> {
        const res = await BlogModel.findById(id);

        if (!res) {
            throw new RepositoryNotFoundError("Blog doesn't exist");
        }
        return res;
    }

    async save(blog: BlogDocument): Promise<WithId<TBlog>> {
        return blog.save();
    }
}
