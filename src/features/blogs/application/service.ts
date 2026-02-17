import { inject, injectable } from 'inversify';
import { CreateUpdateBlogInputModel } from '../api/models';
import { TBlog } from '../domain';
import { BlogsRepository } from '../repository/repository';

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository)
        public blogsRepository: BlogsRepository
    ) {}

    async removeById(id: string): Promise<void> {
        await this.blogsRepository.removeById(id);

        return;
    }

    async create(blogAttributes: CreateUpdateBlogInputModel): Promise<string> {
        const newBlog: TBlog = {
            isMembership: false,
            createdAt: new Date().toISOString(),
            ...blogAttributes,
        };

        return this.blogsRepository.create(newBlog);
    }

    async updateById(id: string, blogAttributes: CreateUpdateBlogInputModel): Promise<void> {
        await this.blogsRepository.updateById(id, blogAttributes);

        return;
    }
}
