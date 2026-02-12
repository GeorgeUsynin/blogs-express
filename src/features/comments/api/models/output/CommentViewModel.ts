export type CommentViewModel = {
    /**
     * Unique identifier of the comment
     */
    id: string;

    /**
     * Comment text content
     */
    content: string;

    /**
     * Information about the comment author
     */
    commentatorInfo: TCommentatorInfo;

    /**
     * Comment creation timestamp in ISO 8601 format
     */
    createdAt: string;
};

type TCommentatorInfo = {
    /**
     * Unique identifier of the user who left the comment
     */
    userId: string;

    /**
     * User login (username)
     */
    userLogin: string;
};
