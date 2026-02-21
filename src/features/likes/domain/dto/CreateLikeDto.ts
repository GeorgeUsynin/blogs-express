import { NonNoneLikeStatus, ParentType } from '../types';

export type CreateLikeDto = {
    authorId: string;
    parentId: string;
    parentType: ParentType;
    likeStatus: NonNoneLikeStatus;
};
