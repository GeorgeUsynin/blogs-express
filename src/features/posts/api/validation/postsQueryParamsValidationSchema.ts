import { makeStrictSchema } from '../../../../core/helpers';
import { queryPaginationAndSortParamsValidationSchema } from '../../../../core/middlewares|validation';
import { PostQueryInput, PostSortFields } from '../models';

export const postsQueryParamsValidationSchema = makeStrictSchema<PostQueryInput>({
    ...queryPaginationAndSortParamsValidationSchema(PostSortFields),
});
