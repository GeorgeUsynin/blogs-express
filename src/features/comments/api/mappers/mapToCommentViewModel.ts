import { WithId } from 'mongodb';
import { CommentViewModel } from '../models';
import { type TComment } from '../../domain';

export const mapToCommentViewModel = (comment: WithId<TComment>): CommentViewModel => ({
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
});
