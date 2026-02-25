import { model, Query, Schema } from 'mongoose';
import { SETTINGS } from '../../../core/settings';
import { CommentDocument, TComment, TCommentModel } from './types';
import { CreateCommentDto } from './dto';
import { NotAnOwnerOfThisComment } from '../../../core/errors';

const commentSchema = new Schema<TComment>({
    content: { type: String, minlength: 20, maxLength: 300, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    likesInfo: {
        dislikesCount: { type: Number, default: 0 },
        likesCount: { type: Number, default: 0 },
    },
    postId: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    isDeleted: { type: Boolean, default: false },
});

export const commentStatics = {
    createComment(dto: CreateCommentDto) {
        const newComment = new CommentModel({
            content: dto.content,
            postId: dto.postId,
            commentatorInfo: {
                userId: dto.userId,
                userLogin: dto.userLogin,
            },
        });

        return newComment;
    },
};

export const commentMethods = {
    ensureCommentOwner(userId: string) {
        const that = this as CommentDocument;

        if (that.commentatorInfo.userId !== userId) {
            throw new NotAnOwnerOfThisComment();
        }

        return true;
    },

    updateContent(content: string) {
        const that = this as CommentDocument;

        that.content = content;
    },

    updateLikesCounts(likesCount: number, dislikesCount: number) {
        const that = this as CommentDocument;

        that.likesInfo.likesCount = likesCount;
        that.likesInfo.dislikesCount = dislikesCount;
    },

    softDelete() {
        const that = this as CommentDocument;

        that.isDeleted = true;
    },
};

commentSchema.statics = commentStatics;
commentSchema.methods = commentMethods;

// Soft delete implementation
commentSchema.pre(/^find/, function () {
    const that = this as Query<unknown, CommentDocument>;
    that.where({ isDeleted: false });
});
commentSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const CommentModel = model<TComment, TCommentModel>(SETTINGS.COLLECTIONS.COMMENTS, commentSchema);
