import { PaginationAndSortingQueryInputModel } from '../../../../../core/models';
import { UserSortFields } from './UserSortFields';

export type UserQueryInput = PaginationAndSortingQueryInputModel<UserSortFields> &
    Partial<{ searchLoginTerm: string; searchEmailTerm: string }>;
