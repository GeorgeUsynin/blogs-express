import { type Request, type Response } from 'express';
import { URIParamsPostModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { postsService } from '../../application';
import { errorsHandler } from '../../../../core/errors';

export const deletePostByIdHandler = async (req: Request<URIParamsPostModel>, res: Response) => {
    try {
        const id = req.params.id;

        await postsService.removeById(id);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
};
