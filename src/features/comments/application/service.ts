import { ForbiddenError } from '../../../core/errors';
import { CreateUpdateCommentInputModel } from '../api/models';
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

    // async create(postAttributes: CreateUpdatePostInputModel): Promise<string> {
    //     const { name: blogName } = await blogsRepository.findByIdOrFail(postAttributes.blogId);

    //     const newPost: TPost = {
    //         blogName,
    //         createdAt: new Date().toISOString(),
    //         ...postAttributes,
    //     };

    //     return postsRepository.create(newPost);
    // },

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
