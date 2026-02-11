import { WithId } from 'mongodb';
import { type TPost } from '../../domain';
import { PostListPaginatedOutput } from '../models';
import { mapToPostViewModel } from './mapToPostViewModel';

export function mapToPostListPaginatedOutput(
    posts: WithId<TPost>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): PostListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts.map(mapToPostViewModel),
    };
}
