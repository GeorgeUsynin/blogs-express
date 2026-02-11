import { type Response } from 'express';
import { PostListPaginatedOutput, PostQueryInput } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToPostListPaginatedOutput } from '../mappers';
import { matchedData } from 'express-validator';
import { asyncHandler, setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers';
import { postsService } from '../../application';
import { RequestWithQuery } from '../../../../core/types';

export const getAllPostsHandler = asyncHandler(async (
    req: RequestWithQuery<Partial<PostQueryInput>>,
    res: Response<PostListPaginatedOutput>
) => {
    const sanitizedQuery = matchedData<PostQueryInput>(req, {
        locations: ['query'],
        includeOptionals: true,
    });

    // double safe in case of default from schema values not applied
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await postsService.findMany(queryInput);

    const postsListOutput = mapToPostListPaginatedOutput(items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
    });

    res.status(HTTP_STATUS_CODES.OK_200).send(postsListOutput);
});
