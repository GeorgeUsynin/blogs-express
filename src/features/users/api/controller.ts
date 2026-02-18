import { inject, injectable } from 'inversify';
import { type Request, type Response } from 'express';
import { matchedData } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../core/constants';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers';
import { RequestWithBody, RequestWithQuery } from '../../../core/types';
import { mapToUserListPaginatedOutput, mapToUserViewModel } from './mappers';
import {
    CreateUserInputModel,
    URIParamsUserModel,
    UserListPaginatedOutput,
    UserQueryInput,
    UserViewModel,
} from './models';
import { UsersService } from '../application/service';
import { UsersQueryRepository } from '../repository/queryRepository';

@injectable()
export class UsersController {
    constructor(
        @inject(UsersService)
        private usersService: UsersService,
        @inject(UsersQueryRepository)
        private usersQueryRepository: UsersQueryRepository
    ) {}

    async getAllUsers(req: RequestWithQuery<Partial<UserQueryInput>>, res: Response<UserListPaginatedOutput>) {
        const sanitizedQuery = matchedData<UserQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const { items, totalCount } = await this.usersQueryRepository.findMany(queryInput);

        const usersListOutput = mapToUserListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HTTP_STATUS_CODES.OK_200).send(usersListOutput);
    }

    async createUser(req: RequestWithBody<CreateUserInputModel>, res: Response<UserViewModel>) {
        const payload = req.body;

        const createdUserId = await this.usersService.create(payload, true);

        const createdUser = await this.usersQueryRepository.findByIdOrFail(createdUserId);

        const mappedUser = mapToUserViewModel(createdUser);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedUser);
    }

    async deleteUserById(req: Request<URIParamsUserModel>, res: Response) {
        const id = req.params.id;

        await this.usersService.removeById(id);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }
}
