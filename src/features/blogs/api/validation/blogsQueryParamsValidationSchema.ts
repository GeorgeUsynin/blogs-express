import { makeStrictSchema } from '../../../../core/helpers';
import { queryPaginationAndSortParamsValidationSchema } from '../../../../core/middlewares|validation';
import { BlogQueryInput, BlogSortFields } from '../models';

export const blogsQueryParamsValidationSchema = makeStrictSchema<BlogQueryInput>({
    ...queryPaginationAndSortParamsValidationSchema(BlogSortFields),
    ...{
        searchNameTerm: {
            optional: true,
        },
    },
});
