import { inject, injectable } from 'inversify';
import { CreateUpdatePostInputModel } from '../api/models';
import { TPost } from '../domain';
import { PostsRepository } from '../repository/repository';
import { BlogsRepository } from '../../blogs/repository/repository';

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository)
        public postsRepository: PostsRepository,
        @inject(BlogsRepository)
        public blogsRepository: BlogsRepository
    ) {}

    async removeById(id: string): Promise<void> {
        await this.postsRepository.removeById(id);

        return;
    }

    async create(postAttributes: CreateUpdatePostInputModel): Promise<string> {
        const { name: blogName } = await this.blogsRepository.findByIdOrFail(postAttributes.blogId);

        const newPost: TPost = {
            blogName,
            createdAt: new Date().toISOString(),
            ...postAttributes,
        };

        return this.postsRepository.create(newPost);
    }

    async updateById(id: string, postAttributes: CreateUpdatePostInputModel): Promise<void> {
        await this.blogsRepository.findByIdOrFail(postAttributes.blogId);

        await this.postsRepository.updateById(id, postAttributes);

        return;
    }
}
