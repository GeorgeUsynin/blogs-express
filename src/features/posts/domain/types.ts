import { HydratedDocument, Model } from 'mongoose';
import { postMethods, postStatics } from './postEntity';

export type TPost = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    isDeleted: boolean;
};

type TPostStatics = typeof postStatics;
type TPostMethods = typeof postMethods;

export type TPostModel = Model<TPost, {}, TPostMethods> & TPostStatics;

export type PostDocument = HydratedDocument<TPost, TPostMethods>;
