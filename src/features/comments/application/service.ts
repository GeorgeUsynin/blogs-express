import { inject, injectable } from 'inversify';
import { PostsRepository } from '../../posts/repository';
import { UsersRepository } from '../../users/repository';
import { CreateUpdateCommentInputModel } from '../api/models';
import { CommentModel } from '../domain';
import { CommentsRepository } from '../repository';
import { CommentNotFoundError, PostNotFoundError, UserNotFoundError } from '../../../core/errors';
import { CommentLikeStatusAttributes } from './dto';
import { ParentType } from '../../likes/domain';
import { LikesService } from '../../likes/application';

@injectable()
export class CommentsService {
    constructor(
        @inject(LikesService)
        private likesService: LikesService,
        @inject(CommentsRepository)
        private commentsRepository: CommentsRepository,
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
        @inject(UsersRepository)
        private usersRepository: UsersRepository
    ) {}

    async create(postId: string, userId: string, commentAttributes: CreateUpdateCommentInputModel): Promise<string> {
        const { content } = commentAttributes;

        const foundPost = await this.postsRepository.findById(postId);
        if (!foundPost) {
            throw new PostNotFoundError();
        }

        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        const newComment = CommentModel.createComment({
            content,
            postId,
            userId,
            userLogin: user.login,
        });

        return this.commentsRepository.save(newComment);
    }

    async updateById(
        commentId: string,
        userId: string,
        commentAttributes: CreateUpdateCommentInputModel
    ): Promise<void> {
        const { content } = commentAttributes;
        const foundComment = await this.findCommentByIdOrThrowNotFound(commentId);

        foundComment.ensureCommentOwner(userId);
        foundComment.updateContent(content);

        await this.commentsRepository.save(foundComment);
    }

    async setCommentLikeStatusById(commentLikeStatusAttributes: CommentLikeStatusAttributes): Promise<void> {
        const { commentId, userId, likeStatus } = commentLikeStatusAttributes;

        const foundComment = await this.findCommentByIdOrThrowNotFound(commentId);

        await this.likesService.setLikeStatus({
            authorId: userId,
            parentId: commentId,
            parentType: ParentType.Comment,
            likeStatus,
        });

        // recalculate and update comment likesCount info
        const { likesCount, dislikesCount } = await this.likesService.getLikesCounts(commentId, ParentType.Comment);
        foundComment.updateLikesCounts(likesCount, dislikesCount);

        await this.commentsRepository.save(foundComment);
    }

    async removeById(commentId: string, userId: string): Promise<void> {
        const foundComment = await this.findCommentByIdOrThrowNotFound(commentId);

        foundComment.ensureCommentOwner(userId);
        foundComment.softDelete();

        await this.commentsRepository.save(foundComment);
    }

    private async findCommentByIdOrThrowNotFound(id: string) {
        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new CommentNotFoundError();
        return comment;
    }
}
