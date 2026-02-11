import { paginationAndSortingDefault } from '../middlewares|validation';
import { PaginationAndSortingQueryInputModel } from '../models';

export function setDefaultSortAndPaginationIfNotExist<P = string>(
    query: Partial<PaginationAndSortingQueryInputModel<P>>
): PaginationAndSortingQueryInputModel<P> {
    return {
        ...paginationAndSortingDefault,
        ...query,
        sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
    };
}
