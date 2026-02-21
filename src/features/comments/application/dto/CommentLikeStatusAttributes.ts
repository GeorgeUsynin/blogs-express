import { LikeStatus } from '../../../../core/constants';

export type CommentLikeStatusAttributes = {
    commentId: string;
    userId: string;
    likeStatus: LikeStatus;
};
