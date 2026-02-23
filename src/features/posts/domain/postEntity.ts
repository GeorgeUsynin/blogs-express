import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../core/settings';
import { PostDocument, TPost, TPostModel } from './types';
import { CreatePostDto, UpdatePostDto } from './dto';

const postSchema = new Schema<TPost>({
    title: { type: String, maxLength: 30, required: true },
    shortDescription: { type: String, maxLength: 100, required: true },
    content: { type: String, maxLength: 1000, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    isDeleted: { type: Boolean, default: false },
});

export const postStatics = {
    createPost(dto: CreatePostDto) {
        const newPost = new PostModel(dto);

        return newPost;
    },
};

export const postMethods = {
    updateAttributes(dto: UpdatePostDto) {
        const that = this as PostDocument;

        that.title = dto.title;
        that.shortDescription = dto.shortDescription;
        that.content = dto.content;
        that.blogId = dto.blogId;
    },

    softDelete() {
        const that = this as PostDocument;

        that.isDeleted = true;
    },
};

postSchema.statics = postStatics;
postSchema.methods = postMethods;

// Soft delete implementation
postSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
postSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
postSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const PostModel = model<TPost, TPostModel>(SETTINGS.COLLECTIONS.POSTS, postSchema);
