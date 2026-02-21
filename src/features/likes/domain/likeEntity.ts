import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../core/settings';
import { CreateLikeDto } from './dto';
import { TLikeModel, TLike, ParentType, LikeDocument } from './types';
import { LikeStatus, NON_NONE_LIKE_STATUSES } from '../../../core/constants';

const likeSchema = new Schema<TLike>({
    authorId: { type: String, required: true },
    parentId: { type: String, required: true },
    parentType: { type: String, enum: Object.values(ParentType), required: true },
    likeStatus: { type: String, enum: NON_NONE_LIKE_STATUSES, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
});

export const likeStatics = {
    createLike(dto: CreateLikeDto) {
        const newBlog = new LikeModel(dto);

        return newBlog;
    },
};

export const likeMethods = {
    isSameLikeStatus(likeStatus: LikeStatus) {
        const that = this as LikeDocument;

        return that.likeStatus === likeStatus;
    },
};

likeSchema.statics = likeStatics;
likeSchema.methods = likeMethods;

export const LikeModel = model<TLike, TLikeModel>(SETTINGS.COLLECTIONS.LIKES, likeSchema);
