import { LikeStatus } from '../../../../../core/constants';

/**
 * View model returned to clients for a single comment.
 * Used in API responses (read-only representation).
 */
export type CommentViewModel = {
    /**
     * Unique identifier of the comment (stringified ObjectId).
     */
    id: string;

    /**
     * Raw text content of the comment.
     * Not trimmed or formatted on the client side.
     */
    content: string;

    /**
     * Information about the user who created the comment.
     */
    commentatorInfo: TCommentatorInfo;

    /**
     * Aggregated likes/dislikes information for the comment,
     * including the current user's reaction.
     */
    likesInfo: TLikesInfo;

    /**
     * Comment creation timestamp in ISO 8601 format (UTC).
     * Example: 2025-02-20T12:34:56.789Z
     */
    createdAt: string;
};

/**
 * Public information about the comment author.
 */
type TCommentatorInfo = {
    /**
     * Unique identifier of the user (stringified ObjectId).
     */
    userId: string;

    /**
     * User login (username) visible to other users.
     */
    userLogin: string;
};

/**
 * Likes/dislikes aggregation model for a comment.
 */
type TLikesInfo = {
    /**
     * Total number of users who liked the comment.
     */
    likesCount: number;

    /**
     * Total number of users who disliked the comment.
     */
    dislikesCount: number;

    /**
     * Current user's like status for this comment.
     * Possible values: 'None' | 'Like' | 'Dislike'
     */
    myStatus: LikeStatus;
};
