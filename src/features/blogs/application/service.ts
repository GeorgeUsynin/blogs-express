import { inject, injectable } from 'inversify';
import { BlogModel } from '../domain';
import { BlogsRepository } from '../repository';
import { BlogNotFoundError } from '../../../core/errors';
import { CreateUpdateBlogDto } from '../domain/dto';

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository)
        private blogsRepository: BlogsRepository
    ) {}

    async create(blogAttributes: CreateUpdateBlogDto): Promise<string> {
        const newBlog = BlogModel.createBlog(blogAttributes);

        return this.blogsRepository.save(newBlog);
    }

    async updateById(id: string, blogAttributes: CreateUpdateBlogDto): Promise<void> {
        const foundBlog = await this.findBlogByIdOrThrowNotFound(id);

        foundBlog.updateAttributes(blogAttributes);

        await this.blogsRepository.save(foundBlog);
    }

    async removeById(id: string): Promise<void> {
        const foundBlog = await this.findBlogByIdOrThrowNotFound(id);

        foundBlog.softDelete();

        await this.blogsRepository.save(foundBlog);
    }

    private async findBlogByIdOrThrowNotFound(id: string) {
        const blog = await this.blogsRepository.findById(id);
        if (!blog) throw new BlogNotFoundError();
        return blog;
    }
}
