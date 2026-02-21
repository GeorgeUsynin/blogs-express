import { CommentViewModel } from '../models';
import { LikeStatus } from '../../../../core/constants';
import { CommentReadModel } from '../../repository/models';

export const mapToCommentViewModel = (comment: CommentReadModel): CommentViewModel => ({
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
    },
    likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: comment.myStatus,
    },
    createdAt: comment.createdAt,
});
