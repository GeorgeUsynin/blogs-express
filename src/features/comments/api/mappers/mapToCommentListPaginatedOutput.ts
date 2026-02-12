import { WithId } from 'mongodb';
import { type TComment } from '../../domain';
import { CommentListPaginatedOutput } from '../models';
import { mapToCommentViewModel } from './mapToCommentViewModel';

export function mapToCommentListPaginatedOutput(
    comments: WithId<TComment>[],
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
