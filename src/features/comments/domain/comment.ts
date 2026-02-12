export type TComment = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: string;
    createdAt: string;
};
