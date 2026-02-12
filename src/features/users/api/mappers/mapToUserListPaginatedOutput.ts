import { WithId } from 'mongodb';
import { TUser } from '../../domain';
import { UserListPaginatedOutput } from '../models';
import { mapToUserViewModel } from './mapToUserViewModel';

export function mapToUserListPaginatedOutput(
    users: WithId<TUser>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): UserListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: users.map(mapToUserViewModel),
    };
}
