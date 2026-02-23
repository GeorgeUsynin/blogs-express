import { LikeStatus } from '../../../../core/constants';
import { ParentType } from '../../domain';

export type SetLikeStatusDto = {
    likeStatus: LikeStatus;
    parentId: string;
    parentType: ParentType;
    authorId: string;
};
