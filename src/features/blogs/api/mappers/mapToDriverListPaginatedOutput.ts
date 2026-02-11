import { WithId } from 'mongodb';
import { TBlog } from '../../domain';
import { BlogListPaginatedOutput } from '../models';
import { mapToBlogViewModel } from './mapToBlogViewModel';

export function mapToBlogListPaginatedOutput(
    blogs: WithId<TBlog>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): BlogListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: blogs.map(mapToBlogViewModel),
    };
}
