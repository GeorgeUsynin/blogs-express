import { inject, injectable } from 'inversify';
import { CreateUpdatePostInputModel } from '../api/models';
import { PostModel } from '../domain';
import { PostsRepository } from '../repository';
import { BlogsRepository } from '../../blogs/repository';
import { BlogNotFoundError, PostNotFoundError } from '../../../core/errors';

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
        @inject(BlogsRepository)
        private blogsRepository: BlogsRepository
    ) {}

    async create(postAttributes: CreateUpdatePostInputModel): Promise<string> {
        const { name: blogName } = await this.findBlogByIdOrThrowNotFound(postAttributes.blogId);

        const newPost = PostModel.createPost({ blogName, ...postAttributes });

        return this.postsRepository.save(newPost);
    }

    async updateById(id: string, postAttributes: CreateUpdatePostInputModel): Promise<void> {
        const { title, shortDescription, content, blogId } = postAttributes;

        await this.findBlogByIdOrThrowNotFound(blogId);

        const foundPost = await this.findPostByIdOrThrowNotFound(id);

        foundPost.title = title;
        foundPost.shortDescription = shortDescription;
        foundPost.content = content;
        foundPost.blogId = blogId;

        await this.postsRepository.save(foundPost);
    }

    async removeById(id: string): Promise<void> {
        const foundPost = await this.findPostByIdOrThrowNotFound(id);

        foundPost.isDeleted = true;

        await this.postsRepository.save(foundPost);
    }

    private async findBlogByIdOrThrowNotFound(id: string) {
        const blog = await this.blogsRepository.findById(id);
        if (!blog) throw new BlogNotFoundError();
        return blog;
    }

    private async findPostByIdOrThrowNotFound(id: string) {
        const post = await this.postsRepository.findById(id);
        if (!post) throw new PostNotFoundError();
        return post;
    }
}
