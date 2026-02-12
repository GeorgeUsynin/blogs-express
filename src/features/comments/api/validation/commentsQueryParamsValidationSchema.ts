import { makeStrictSchema } from '../../../../core/helpers';
import { queryPaginationAndSortParamsValidationSchema } from '../../../../core/middlewares|validation';
import { CommentQueryInput, CommentSortFields } from '../models';

export const commentsQueryParamsValidationSchema = makeStrictSchema<CommentQueryInput>({
    ...queryPaginationAndSortParamsValidationSchema(CommentSortFields),
});
