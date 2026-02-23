import { PostViewModel } from '../models';
import { PostReadModel } from '../../repository/models';

export const mapToPostViewModel = (post: PostReadModel): PostViewModel => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
        myStatus: post.myStatus,
        likesCount: post.likesInfo.likesCount,
        dislikesCount: post.likesInfo.dislikesCount,
        newestLikes: post.newestLikes.map(like => ({
            addedAt: like.createdAt,
            userId: like.authorId,
            login: like.authorLogin,
        })),
    },
});
