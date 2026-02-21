import { inject, injectable } from 'inversify';
import { CreateUpdateBlogInputModel } from '../api/models';
import { BlogModel } from '../domain';
import { BlogsRepository } from '../repository';
import { BlogNotFoundError } from '../../../core/errors';

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository)
        private blogsRepository: BlogsRepository
    ) {}

    async create(blogAttributes: CreateUpdateBlogInputModel): Promise<string> {
        const newBlog = BlogModel.createBlog(blogAttributes);

        return this.blogsRepository.save(newBlog);
    }

    async updateById(id: string, blogAttributes: CreateUpdateBlogInputModel): Promise<void> {
        const { description, name, websiteUrl } = blogAttributes;

        const foundBlog = await this.findBlogByIdOrThrowNotFound(id);

        foundBlog.name = name;
        foundBlog.description = description;
        foundBlog.websiteUrl = websiteUrl;

        await this.blogsRepository.save(foundBlog);
    }

    async removeById(id: string): Promise<void> {
        const foundBlog = await this.findBlogByIdOrThrowNotFound(id);

        foundBlog.isDeleted = true;

        await this.blogsRepository.save(foundBlog);
    }

    private async findBlogByIdOrThrowNotFound(id: string) {
        const blog = await this.blogsRepository.findById(id);
        if (!blog) throw new BlogNotFoundError();
        return blog;
    }
}
