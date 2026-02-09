export type TBlog = {
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: string;
};

export type TPost = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};
