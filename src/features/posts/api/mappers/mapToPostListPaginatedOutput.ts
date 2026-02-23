import { PostListPaginatedOutput } from '../models';
import { mapToPostViewModel } from './mapToPostViewModel';
import { PostReadModel } from '../../repository/models';

export function mapToPostListPaginatedOutput(
    posts: PostReadModel[],
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
