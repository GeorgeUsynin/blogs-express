import { WithId } from 'mongodb';
import { TPost } from '../../domain';
import { LikeStatus } from '../../../../core/constants';

export type TNewestLikes = {
    createdAt: string;
    authorId: string;
    authorLogin: string;
};

export type PostReadModel = WithId<TPost & { myStatus: LikeStatus; newestLikes: TNewestLikes[] }>;
