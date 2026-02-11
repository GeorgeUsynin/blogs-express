import { PaginationAndSortingQueryInputModel } from '../../../../../core/models';
import { BlogSortFields } from './BlogSortFields';

export type BlogQueryInput = PaginationAndSortingQueryInputModel<BlogSortFields> & Partial<{ searchNameTerm: string }>;
