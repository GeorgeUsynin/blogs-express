import { CommentListPaginatedOutput } from '../models';
import { mapToCommentViewModel } from './mapToCommentViewModel';
import { CommentReadModel } from '../../repository/models';

export function mapToCommentListPaginatedOutput(
    comments: CommentReadModel[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): CommentListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: comments.map(mapToCommentViewModel),
    };
}
