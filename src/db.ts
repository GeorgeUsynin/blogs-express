export type TBlog = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
};

export type TPost = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
};

export type DBType = {
    blogs: TBlog[];
    posts: TPost[];
};

export const db: DBType = {
    blogs: [],
    posts: [],
};

export const setDB = (dataset?: DBType) => {
    if (!dataset) {
        db.blogs = [];
        db.posts = [];
        return;
    }

    db.blogs = dataset.blogs;
    db.posts = dataset.posts;
};
