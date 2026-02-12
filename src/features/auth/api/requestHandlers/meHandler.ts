import { type Request, type Response } from 'express';
import { MeOutputModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { usersQueryRepository } from '../../../users/repository';
import { mapToMeViewModel } from '../mappers/mapToMeViewModel';

export const meHandler = async (req: Request, res: Response<MeOutputModel>) => {
    const userId = req.userId!;

    const user = await usersQueryRepository.findByIdOrFail(userId);

    const mappedMeUser = mapToMeViewModel(user);

    res.status(HTTP_STATUS_CODES.OK_200).send(mappedMeUser);
};
