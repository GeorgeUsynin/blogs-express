import { type Request, type Response } from 'express';
import { URIParamsCommentModel, CommentViewModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToCommentViewModel } from '../mappers';
import { commentsQueryRepository } from '../../repository';

export const getCommentByIdHandler = async (req: Request<URIParamsCommentModel>, res: Response<CommentViewModel>) => {
    const id = req.params.id;

    const foundComment = await commentsQueryRepository.findByIdOrFail(id);

    const mappedComment = mapToCommentViewModel(foundComment);

    res.status(HTTP_STATUS_CODES.OK_200).send(mappedComment);
};
