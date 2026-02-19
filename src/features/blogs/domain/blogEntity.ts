import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../core/settings';
import { CreateUpdateBlogDto } from '../application/dto';
import { TBlog, TBlogModel } from './types';

const pattern = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';
// Soft delete implementation

const blogSchema = new Schema<TBlog>({
    name: { type: String, maxLength: 15, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    description: { type: String, maxLength: 500, required: true },
    isMembership: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    websiteUrl: {
        type: String,
        maxLength: 100,
        required: true,
        validate: {
            validator: function (v) {
                return /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(v);
            },
            message: props => `WebsiteUrl should match the specified ${pattern} pattern`,
        },
    },
});

export const blogStatics = {
    createBlog(dto: CreateUpdateBlogDto) {
        const newBlog = new BlogModel(dto);

        return newBlog;
    },
};

blogSchema.statics = blogStatics;

// Soft delete implementation
blogSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
blogSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
blogSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const BlogModel = model<TBlog, TBlogModel>(SETTINGS.COLLECTIONS.BLOGS, blogSchema);
