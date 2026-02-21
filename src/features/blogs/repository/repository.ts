import { injectable } from 'inversify';
import { BlogDocument, BlogModel } from '../domain';

@injectable()
export class BlogsRepository {
    async findById(id: string): Promise<BlogDocument | null> {
        return BlogModel.findById(id);
    }

    async save(blog: BlogDocument): Promise<string> {
        const newBlog = await blog.save();

        return newBlog._id.toString();
    }
}
