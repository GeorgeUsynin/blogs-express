import { inject, injectable } from 'inversify';
import { WithId } from 'mongodb';
import { CreateUpdatePostInputModel } from '../api/models';
import { PostModel, TPost } from '../domain';
import { PostsRepository } from '../repository/repository';
import { BlogsRepository } from '../../blogs/repository/repository';

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
        @inject(BlogsRepository)
        private blogsRepository: BlogsRepository
    ) {}

    async create(postAttributes: CreateUpdatePostInputModel): Promise<WithId<TPost>> {
        const { name: blogName } = await this.blogsRepository.findByIdOrFail(postAttributes.blogId);

        const newPost = PostModel.createPost({ blogName, ...postAttributes });

        return this.postsRepository.save(newPost);
    }

    async updateById(id: string, postAttributes: CreateUpdatePostInputModel): Promise<void> {
        const { title, shortDescription, content, blogId } = postAttributes;

        await this.blogsRepository.findByIdOrFail(postAttributes.blogId);

        const foundPost = await this.postsRepository.findByIdOrFail(id);

        foundPost.title = title;
        foundPost.shortDescription = shortDescription;
        foundPost.content = content;
        foundPost.blogId = blogId;

        await this.postsRepository.save(foundPost);
    }

    async removeById(id: string): Promise<void> {
        const foundPost = await this.postsRepository.findByIdOrFail(id);

        foundPost.isDeleted = true;

        await this.postsRepository.save(foundPost);
    }
}
