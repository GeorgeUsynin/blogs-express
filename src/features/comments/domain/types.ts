import { HydratedDocument, Model } from 'mongoose';
import { commentMethods, commentStatics } from './commentEntity';

export type TComment = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    likesInfo: {
        dislikesCount: number;
        likesCount: number;
    };
    postId: string;
    createdAt: string;
    isDeleted: boolean;
};

type TCommentStatics = typeof commentStatics;
type TCommentMethods = typeof commentMethods;

export type TCommentModel = Model<TComment, {}, TCommentMethods> & TCommentStatics;

export type CommentDocument = HydratedDocument<TComment, TCommentMethods>;
