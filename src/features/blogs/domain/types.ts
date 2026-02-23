import { HydratedDocument, Model } from 'mongoose';
import { blogMethods, blogStatics } from './blogEntity';

export type TBlog = {
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: string;
    isDeleted: boolean;
};

type TBlogStatics = typeof blogStatics;
type TBlogMethods = typeof blogMethods;

export type TBlogModel = Model<TBlog, {}, TBlogMethods> & TBlogStatics;

export type BlogDocument = HydratedDocument<TBlog, TBlogMethods>;
