import { WithId } from 'mongodb';
import { TPost } from '../../../../db';
import { PostViewModel } from '../../models';

export const mapToPostViewModel = (post: WithId<TPost>): PostViewModel => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
});
