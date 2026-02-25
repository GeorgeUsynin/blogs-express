import { inject, injectable } from 'inversify';
import { CreateUpdatePostInputModel } from '../api/models';
import { PostModel } from '../domain';
import { PostsRepository } from '../repository';
import { BlogsRepository } from '../../blogs/repository';
import { BlogNotFoundError, PostNotFoundError } from '../../../core/errors';
import { PostLikeStatusAttributes } from './dto';
import { ParentType } from '../../likes/domain';
import { LikesService } from '../../likes/application';

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
        @inject(BlogsRepository)
        private blogsRepository: BlogsRepository,
        @inject(LikesService)
        private likesService: LikesService
    ) {}

    async create(postAttributes: CreateUpdatePostInputModel): Promise<string> {
        const { name: blogName } = await this.findBlogByIdOrThrowNotFound(postAttributes.blogId);

        const newPost = PostModel.createPost({ blogName, ...postAttributes });

        await this.postsRepository.save(newPost);

        return newPost._id.toString();
    }

    async updateById(id: string, postAttributes: CreateUpdatePostInputModel): Promise<void> {
        await this.findBlogByIdOrThrowNotFound(postAttributes.blogId);

        const foundPost = await this.findPostByIdOrThrowNotFound(id);

        foundPost.updateAttributes(postAttributes);

        await this.postsRepository.save(foundPost);
    }

    async setPostLikeStatusById(postLikeStatusAttributes: PostLikeStatusAttributes): Promise<void> {
        const { postId, userId, likeStatus } = postLikeStatusAttributes;

        const foundPost = await this.findPostByIdOrThrowNotFound(postId);

        await this.likesService.setLikeStatus({
            authorId: userId,
            parentId: postId,
            parentType: ParentType.Post,
            likeStatus,
        });

        // recalculate and update post likesCount info
        const { likesCount, dislikesCount } = await this.likesService.getLikesCounts(postId, ParentType.Post);
        foundPost.updateLikesCounts(likesCount, dislikesCount);

        await this.postsRepository.save(foundPost);
    }

    async removeById(id: string): Promise<void> {
        const foundPost = await this.findPostByIdOrThrowNotFound(id);

        foundPost.softDelete();

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
