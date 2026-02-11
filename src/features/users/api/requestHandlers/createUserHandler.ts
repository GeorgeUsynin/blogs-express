import { type Response } from 'express';
import { type RequestWithBody } from '../../../../core/types';
import { CreateUserInputModel, UserViewModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToUserViewModel } from '../mappers';
import { asyncHandler } from '../../../../core/helpers';
import { usersService } from '../../application';
import { usersQueryRepository } from '../../repository';

export const createUserHandler = asyncHandler(
    async (req: RequestWithBody<CreateUserInputModel>, res: Response<UserViewModel>) => {
        const payload = req.body;

        const createdUserId = await usersService.create(payload);

        const createdUser = await usersQueryRepository.findByIdOrFail(createdUserId);

        const mappedUser = mapToUserViewModel(createdUser);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedUser);
    }
);
