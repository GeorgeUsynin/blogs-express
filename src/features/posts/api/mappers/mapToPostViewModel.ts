import { WithId } from 'mongodb';
import { PostViewModel } from '../models';
import { type TPost } from '../../domain';

export const mapToPostViewModel = (post: WithId<TPost>): PostViewModel => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
});
