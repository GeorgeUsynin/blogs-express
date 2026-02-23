import { LikeStatus } from '../../../../core/constants';

export type PostLikeStatusAttributes = {
    postId: string;
    userId: string;
    likeStatus: LikeStatus;
};
