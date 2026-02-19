import { WithId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { PostsRepository } from '../../posts/repository/repository';
import { UsersRepository } from '../../users/repository/repository';
import { CreateUpdateCommentInputModel } from '../api/models';
import { CommentModel, TComment } from '../domain';
import { CommentsRepository } from '../repository/repository';

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

        await this.postsRepository.findByIdOrFail(postId);

        const { login } = await this.usersRepository.findByIdOrFail(userId);

        const newComment = CommentModel.createComment({
            content,
            postId,
            commentatorInfo: {
                userId,
                userLogin: login,
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
        const foundComment = await this.commentsRepository.findByIdOrFail(commentId);

        if (foundComment.isCommentOwner(userId)) {
            foundComment.content = content;
            await this.commentsRepository.save(foundComment);
        }
    }

    async removeById(commentId: string, userId: string): Promise<void> {
        const foundComment = await this.commentsRepository.findByIdOrFail(commentId);

        if (foundComment.isCommentOwner(userId)) {
            foundComment.isDeleted = true;

            await this.commentsRepository.save(foundComment);
        }
    }
}
