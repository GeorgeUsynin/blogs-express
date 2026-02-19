import { HydratedDocument, Model } from 'mongoose';
import { blogStatics } from './blogEntity';

export type TBlog = {
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: string;
    isDeleted: boolean;
};

type BlogStatics = typeof blogStatics;

export type TBlogModel = Model<TBlog, {}> & BlogStatics;

export type BlogDocument = HydratedDocument<TBlog>;
