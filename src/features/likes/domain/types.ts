import { HydratedDocument, Model } from 'mongoose';
import { LikeStatus } from '../../../core/constants';
import { likeMethods, likeStatics } from './likeEntity';

export enum ParentType {
    Comment = 'comment',
    Post = 'post',
}

export type NonNoneLikeStatus = Exclude<LikeStatus, LikeStatus.None>;

export type TLike = {
    authorId: string;
    parentId: string;
    parentType: ParentType;
    likeStatus: NonNoneLikeStatus;
    createdAt: string;
};

type LikeStatics = typeof likeStatics;
type LikeMethods = typeof likeMethods;

export type TLikeModel = Model<TLike, {}, LikeMethods> & LikeStatics;

export type LikeDocument = HydratedDocument<TLike, LikeMethods>;
