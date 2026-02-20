import { WithId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { PostsRepository } from '../../posts/repository/repository';
import { UsersRepository } from '../../users/repository/repository';
import { CreateUpdateCommentInputModel } from '../api/models';
import { CommentModel, TComment } from '../domain';
import { CommentsRepository } from '../repository/repository';
import { CommentNotFoundError, PostNotFoundError, UserNotFoundError } from '../../../core/errors';

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository)
        private commentsRepository: CommentsRepository,
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
        @inject(UsersRepository)
        private usersRepository: UsersRepository
    ) {}

    async create(
        postId: string,
        userId: string,
        commentAttributes: CreateUpdateCommentInputModel
    ): Promise<WithId<TComment>> {
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
