import { type Request, type Response } from 'express';
import { matchedData } from 'express-validator';
import { BlogListPaginatedOutput, BlogQueryInput } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToBlogListPaginatedOutput } from '../mappers';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers';
import { blogsService } from '../../application';
import { errorsHandler } from '../../../../core/errors';

export const getAllBlogsHandler = async (req: Request, res: Response<BlogListPaginatedOutput>) => {
    try {
        const sanitizedQuery = matchedData<BlogQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });

        // double safe in case of default from schema values not applied
        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const { items, totalCount } = await blogsService.findMany(queryInput);

        const blogsListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HTTP_STATUS_CODES.OK_200).send(blogsListOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
};
