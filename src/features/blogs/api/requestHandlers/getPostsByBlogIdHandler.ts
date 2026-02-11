import { type Response } from 'express';
import { matchedData } from 'express-validator';
import { PostListPaginatedOutput, PostQueryInput } from '../../../posts/api/models';
import { URIParamsBlogModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { asyncHandler, setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers';
import { postsService } from '../../../posts/application';
import { mapToPostListPaginatedOutput } from '../../../posts/api/mappers';
import { RequestWithParamsAndQuery } from '../../../../core/types';

export const getPostsByBlogIdHandler = asyncHandler(
    async (
        req: RequestWithParamsAndQuery<URIParamsBlogModel, Partial<PostQueryInput>>,
        res: Response<PostListPaginatedOutput>
    ) => {
        const id = req.params.id;
        const sanitizedQuery = matchedData<PostQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });

        // double safe in case of default from schema values not applied
        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const { items, totalCount } = await postsService.findManyByBlogId(id, queryInput);

        const blogsListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HTTP_STATUS_CODES.OK_200).send(blogsListOutput);
    }
);
