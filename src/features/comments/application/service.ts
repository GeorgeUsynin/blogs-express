import { inject, injectable } from 'inversify';
import { ForbiddenError } from '../../../core/errors';
import { PostsRepository } from '../../posts/repository/repository';
import { UsersRepository } from '../../users/repository/repository';
import { CreateUpdateCommentInputModel } from '../api/models';
import { TComment } from '../domain';
import { CommentsRepository } from '../repository/repository';

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository)
        public commentsRepository: CommentsRepository,
        @inject(PostsRepository)
        public postsRepository: PostsRepository,
        @inject(UsersRepository)
        public usersRepository: UsersRepository
    ) {}

    async removeById(commentId: string, userId: string): Promise<void> {
        const foundComment = await this.commentsRepository.findByIdOrFail(commentId);

        const isUserComment = foundComment.commentatorInfo.userId === userId;

        if (!isUserComment) {
            throw new ForbiddenError(`You can't delete someone else's comment.`);
        }

        await this.commentsRepository.removeById(commentId);

        return;
    }

    async create(postId: string, userId: string, commentAttributes: CreateUpdateCommentInputModel): Promise<string> {
        await this.postsRepository.findByIdOrFail(postId);

        const { login } = await this.usersRepository.findByIdOrFail(userId);

        const newComment: TComment = {
            postId,
            commentatorInfo: {
                userId,
                userLogin: login,
            },
            createdAt: new Date().toISOString(),
            ...commentAttributes,
        };

        return this.commentsRepository.create(newComment);
    }

    async updateById(commentId: string, userId: string, commentAttributes: CreateUpdateCommentInputModel): Promise<void> {
        const foundComment = await this.commentsRepository.findByIdOrFail(commentId);

        const isUserComment = foundComment.commentatorInfo.userId === userId;

        if (!isUserComment) {
            throw new ForbiddenError(`You can't update someone else's comment.`);
        }

        await this.commentsRepository.updateById(commentId, commentAttributes);

        return;
    }
}
