import { type Request, type Response } from 'express';
import { URIParamsCommentModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { commentsService } from '../../application';

export const deleteCommentByIdHandler = async (req: Request<URIParamsCommentModel>, res: Response) => {
    const userId = req.userId!;
    const id = req.params.id;

    await commentsService.removeById(id, userId);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
