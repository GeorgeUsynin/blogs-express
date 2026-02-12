import { ForbiddenError } from '../../../core/errors';
import { postsRepository } from '../../posts/repository';
import { usersRepository } from '../../users/repository';
import { CreateUpdateCommentInputModel } from '../api/models';
import { TComment } from '../domain';
import { commentsRepository } from '../repository';

export const commentsService = {
    async removeById(commentId: string, userId: string): Promise<void> {
        const foundComment = await commentsRepository.findByIdOrFail(commentId);

        const isUserComment = foundComment.commentatorInfo.userId === userId;

        if (!isUserComment) {
            throw new ForbiddenError(`You can't delete someone else's comment.`);
        }

        await commentsRepository.removeById(commentId);

        return;
    },

    async create(postId: string, userId: string, commentAttributes: CreateUpdateCommentInputModel): Promise<string> {
        await postsRepository.findByIdOrFail(postId);

        const { login } = await usersRepository.findByIdOrFail(userId);

        const newComment: TComment = {
            postId,
            commentatorInfo: {
                userId,
                userLogin: login,
            },
            createdAt: new Date().toISOString(),
            ...commentAttributes,
        };

        return commentsRepository.create(newComment);
    },

    async updateById(
        commentId: string,
        userId: string,
        commentAttributes: CreateUpdateCommentInputModel
    ): Promise<void> {
        const foundComment = await commentsRepository.findByIdOrFail(commentId);

        const isUserComment = foundComment.commentatorInfo.userId === userId;

        if (!isUserComment) {
            throw new ForbiddenError(`You can't update someone else's comment.`);
        }

        await commentsRepository.updateById(commentId, commentAttributes);

        return;
    },
};
