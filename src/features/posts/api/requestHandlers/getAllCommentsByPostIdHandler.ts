import { type Response } from 'express';
import { matchedData } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers';
import { RequestWithParamsAndQuery } from '../../../../core/types';
import { postsQueryRepository } from '../../../posts/repository';
import { CommentListPaginatedOutput } from '../../../comments/api/models';
import { CommentQueryInput } from '../../../comments/api/models/input/CommentQueryInput';
import { commentsQueryRepository } from '../../../comments/repository';
import { mapToCommentListPaginatedOutput } from '../../../comments/api/mappers';
import { URIParamsPostModel } from '../models';

export const getAllCommentsByPostIdHandler = async (
    req: RequestWithParamsAndQuery<URIParamsPostModel, Partial<CommentQueryInput>>,
    res: Response<CommentListPaginatedOutput>
) => {
    const postId = req.params.id;

    await postsQueryRepository.findByIdOrFail(postId);

    const sanitizedQuery = matchedData<CommentQueryInput>(req, {
        locations: ['query'],
        includeOptionals: true,
    });

    // double safe in case of default from schema values not applied
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await commentsQueryRepository.findManyByPostId(postId, queryInput);

    const commentsListOutput = mapToCommentListPaginatedOutput(items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
    });

    res.status(HTTP_STATUS_CODES.OK_200).send(commentsListOutput);
};
