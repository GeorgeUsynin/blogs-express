import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../core/settings';
import { CommentDocument, TComment, TCommentModel } from './types';
import { CreateCommentDto } from '../application/dto';
import { NotAnOwnerOfThisComment } from '../../../core/errors';

const commentSchema = new Schema<TComment>({
    content: { type: String, minlength: 20, maxLength: 300, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    postId: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    isDeleted: { type: Boolean, default: false },
});

export const commentStatics = {
    createComment(dto: CreateCommentDto) {
        const newComment = new CommentModel(dto);

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
};

commentSchema.statics = commentStatics;
commentSchema.methods = commentMethods;

// Soft delete implementation
commentSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
commentSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
commentSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const CommentModel = model<TComment, TCommentModel>(SETTINGS.COLLECTIONS.COMMENTS, commentSchema);
