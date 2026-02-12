import { type Response } from 'express';
import { UserListPaginatedOutput, UserQueryInput } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToUserListPaginatedOutput } from '../mappers';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers';
import { RequestWithQuery } from '../../../../core/types';
import { usersQueryRepository } from '../../repository';

export const getAllUsersHandler = async (req: RequestWithQuery<Partial<UserQueryInput>>, res: Response<UserListPaginatedOutput>) => {
        const sanitizedQuery = matchedData<UserQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });

        // double safe in case of default from schema values not applied
        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const { items, totalCount } = await usersQueryRepository.findMany(queryInput);

        const postsListOutput = mapToUserListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HTTP_STATUS_CODES.OK_200).send(postsListOutput);
    }
