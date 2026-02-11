import { makeStrictSchema } from '../../../../core/helpers';
import { queryPaginationAndSortParamsValidationSchema } from '../../../../core/middlewares|validation';
import { UserQueryInput, UserSortFields } from '../models';

export const queryParamsValidationSchema = makeStrictSchema<UserQueryInput>({
    ...queryPaginationAndSortParamsValidationSchema(UserSortFields),
    ...{
        searchLoginTerm: {
            optional: true,
        },
        searchEmailTerm: {
            optional: true,
        },
    },
});
