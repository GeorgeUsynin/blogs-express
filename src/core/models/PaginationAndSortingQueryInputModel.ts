import { SortDirection } from '../types';

export type PaginationAndSortingQueryInputModel<S> = {
    pageNumber: number;
    pageSize: number;
    sortBy: S;
    sortDirection: SortDirection;
};
