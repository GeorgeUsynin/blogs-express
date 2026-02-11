import { SortDirection } from '../types';
import { StrictSchema } from '../helpers';
import { PaginationAndSortingQueryInputModel } from '../models';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: PaginationAndSortingQueryInputModel<string> = {
    pageNumber: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,
};

export function queryPaginationAndSortParamsValidationSchema<T extends string>(
    sortFieldsEnum: Record<string, T>
): StrictSchema<PaginationAndSortingQueryInputModel<T>> {
    const allowedSortFields = Object.values(sortFieldsEnum);
    const allowedSortDirections = Object.values(SortDirection);

    return {
        sortBy: {
            default: {
                options: DEFAULT_SORT_BY,
            },
            isIn: {
                options: [allowedSortFields],
                errorMessage: `SortBy field should be equal one of the following values: ${allowedSortFields.join(
                    ', '
                )}`,
            },
        },
        sortDirection: {
            default: {
                options: DEFAULT_SORT_DIRECTION,
            },
            isIn: {
                options: [allowedSortDirections], // List of allowed values for sortDirection
                errorMessage: `Sort direction must be one of: ${allowedSortDirections.join(', ')}`,
            },
        },
        pageNumber: {
            default: {
                options: DEFAULT_PAGE_NUMBER,
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'PageNumber field should be a positive number',
            },
            toInt: true,
        },
        pageSize: {
            default: {
                options: DEFAULT_PAGE_SIZE,
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'PageSize field should be a positive number',
            },
            toInt: true,
        },
    };
}
