import { type Request, type Response } from 'express';
import { URIParamsUserModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { usersService } from '../../application';

export const deleteUserByIdHandler = async (req: Request<URIParamsUserModel>, res: Response) => {
    const id = req.params.id;

    await usersService.removeById(id);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
