import { ObjectId } from 'mongodb';

export type TBlog = {
    id: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: string;
};

export type TPost = {
    id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};
