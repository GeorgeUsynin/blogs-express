import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { BlogDocument, BlogModel, TBlog } from '../domain';

@injectable()
export class BlogsRepository {
    async findById(id: string): Promise<BlogDocument | null> {
        return BlogModel.findById(id);
    }

    async save(blog: BlogDocument): Promise<WithId<TBlog>> {
        return blog.save();
    }
}
