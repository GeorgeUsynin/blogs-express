import { LikeStatus } from '../../../../../core/constants';

export type PostViewModel = {
    /**
     * Unique identifier of the post (UUID)
     */
    id: string;

    /**
     * Title of the post
     */
    title: string;

    /**
     * Short description (preview text) of the post
     */
    shortDescription: string;

    /**
     * Full content of the post (HTML or plain text depending on implementation)
     */
    content: string;

    /**
     * Identifier of the blog to which the post belongs (UUID)
     */
    blogId: string;

    /**
     * Name of the blog to which the post belongs
     */
    blogName: string;

    /**
     * Date and time when the post was created (ISO 8601 string, UTC)
     */
    createdAt: string;

    /**
     * Aggregated information about likes and dislikes
     */
    extendedLikesInfo: TExtendedLikesInfo;
};

type TExtendedLikesInfo = {
    /**
     * Total number of likes for the post
     */
    likesCount: number;

    /**
     * Total number of dislikes for the post
     */
    dislikesCount: number;

    /**
     * Current user's like status for this post
     * (Like | Dislike | None)
     */
    myStatus: LikeStatus;

    /**
     * List of the most recent likes (up to 3 items)
     */
    newestLikes: TNewestLike[];
};

type TNewestLike = {
    /**
     * Date and time when the like was added (ISO 8601 string, UTC)
     */
    addedAt: string;

    /**
     * Identifier of the user who liked the post (UUID)
     */
    userId: string;

    /**
     * Login (username) of the user who liked the post
     */
    login: string;
};
