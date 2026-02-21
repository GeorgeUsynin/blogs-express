import { inject, injectable } from 'inversify';
import { PostsRepository } from '../../posts/repository';
import { UsersRepository } from '../../users/repository';
import { CreateUpdateCommentInputModel } from '../api/models';
import { CommentModel } from '../domain';
import { CommentsRepository } from '../repository';
import { CommentNotFoundError, PostNotFoundError, UserNotFoundError } from '../../../core/errors';
import { CommentLikeStatusAttributes } from './dto';
import { LikesRepository } from '../../likes/repository';
import { LikeModel, ParentType } from '../../likes/domain';
import { LikeStatus } from '../../../core/constants';

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository)
        private commentsRepository: CommentsRepository,
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
        @inject(LikesRepository)
        private likesRepository: LikesRepository,
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
            commentatorInfo: {
                userId,
                userLogin: user.login,
            },
        });

        return this.commentsRepository.save(newComment);
    }

    async updateById(
        commentId: string,
        userId: string,
        commentAttributes: CreateUpdateCommentInputModel
    ): Promise<void> {
        const { content } = commentAttributes;
        const foundComment = await this.commentsRepository.findById(commentId);

        if (!foundComment) {
            throw new CommentNotFoundError();
        }

        foundComment.ensureCommentOwner(userId);

        foundComment.content = content;
        await this.commentsRepository.save(foundComment);
    }

    async setCommentLikeStatusById(commentLikeStatusAttributes: CommentLikeStatusAttributes): Promise<void> {
        const { commentId, userId, likeStatus } = commentLikeStatusAttributes;

        const foundComment = await this.commentsRepository.findById(commentId);

        if (!foundComment) {
            throw new CommentNotFoundError();
        }

        const foundLike = await this.likesRepository.findByParentAndAuthor(commentId, ParentType.Comment, userId);

        if (!foundLike) {
            // not allowing like creation with None status
            if (likeStatus === LikeStatus.None) return;

            const newLike = LikeModel.createLike({
                authorId: userId,
                parentId: commentId,
                likeStatus,
                parentType: ParentType.Comment,
            });
            await this.likesRepository.save(newLike);
        } else {
            // if likeStatus is the same -> exit
            if (foundLike.isSameLikeStatus(likeStatus)) return;

            switch (likeStatus) {
                case LikeStatus.None:
                    await this.likesRepository.removeById(foundLike._id.toString());
                    break;
                case LikeStatus.Like:
                case LikeStatus.Dislike:
                    foundLike.likeStatus = likeStatus;
                    await this.likesRepository.save(foundLike);
                    break;
            }
        }

        // recalculate and update comment likesCount info
        const [likesCount, dislikesCount] = await Promise.all([
            this.likesRepository.countByParentAndStatus(commentId, ParentType.Comment, LikeStatus.Like),
            this.likesRepository.countByParentAndStatus(commentId, ParentType.Comment, LikeStatus.Dislike),
        ]);

        foundComment.likesInfo.likesCount = likesCount;
        foundComment.likesInfo.dislikesCount = dislikesCount;

        await this.commentsRepository.save(foundComment);
    }

    async removeById(commentId: string, userId: string): Promise<void> {
        const foundComment = await this.commentsRepository.findById(commentId);

        if (!foundComment) {
            throw new CommentNotFoundError();
        }

        foundComment.ensureCommentOwner(userId);

        foundComment.isDeleted = true;
        await this.commentsRepository.save(foundComment);
    }
}
