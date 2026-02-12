import { type Response } from 'express';
import { RequestWithParamsAndBody } from '../../../../core/types';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { CommentViewModel, CreateUpdateCommentInputModel, URIParamsCommentModel } from '../models';
import { commentsService } from '../../application';

export const updateCommentByIdHandler = async (
    req: RequestWithParamsAndBody<URIParamsCommentModel, CreateUpdateCommentInputModel>,
    res: Response<CommentViewModel>
) => {
    const id = req.params.id;
    const userId = req.userId!;
    const payload = req.body;

    await commentsService.updateById(id, userId, payload);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
