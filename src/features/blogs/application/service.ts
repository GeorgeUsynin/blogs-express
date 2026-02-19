import { inject, injectable } from 'inversify';
import { CreateUpdateBlogInputModel } from '../api/models';
import { BlogModel, TBlog } from '../domain';
import { BlogsRepository } from '../repository/repository';
import { WithId } from 'mongodb';

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository)
        private blogsRepository: BlogsRepository
    ) {}

    async create(blogAttributes: CreateUpdateBlogInputModel): Promise<WithId<TBlog>> {
        const newBlog = BlogModel.createBlog(blogAttributes);

        return this.blogsRepository.save(newBlog);
    }

    async updateById(id: string, blogAttributes: CreateUpdateBlogInputModel): Promise<void> {
        const { description, name, websiteUrl } = blogAttributes;

        const foundBlog = await this.blogsRepository.findByIdOrFail(id);

        foundBlog.name = name;
        foundBlog.description = description;
        foundBlog.websiteUrl = websiteUrl;

        await this.blogsRepository.save(foundBlog);
    }

    async removeById(id: string): Promise<void> {
        const foundBlog = await this.blogsRepository.findByIdOrFail(id);

        foundBlog.isDeleted = true;

        await this.blogsRepository.save(foundBlog);
    }
}
