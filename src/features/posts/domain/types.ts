import { HydratedDocument, Model } from 'mongoose';
import { postStatics } from './postEntity';

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

export type TPostModel = Model<TPost, {}> & TPostStatics;

export type PostDocument = HydratedDocument<TPost>;
