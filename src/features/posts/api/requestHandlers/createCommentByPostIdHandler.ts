import { type Response } from 'express';
import { type RequestWithParamsAndBody } from '../../../../core/types';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { URIParamsPostModel } from '../../../posts/api/models';
import { mapToPostViewModel } from '../../../posts/api/mappers';
import { CommentViewModel, CreateUpdateCommentInputModel, URIParamsCommentModel } from '../../../comments/api/models';
import { commentsService } from '../../../comments/application';
import { commentsQueryRepository } from '../../../comments/repository';
import { mapToCommentViewModel } from '../../../comments/api/mappers';

export const createCommentByPostIdHandler = async (
    req: RequestWithParamsAndBody<URIParamsPostModel, CreateUpdateCommentInputModel>,
    res: Response<CommentViewModel>
) => {
    const postId = req.params.id;
    const userId = req.userId!;
    const payload = req.body;

    const createdCommentId = await commentsService.create(postId, userId, payload);

    const createdComment = await commentsQueryRepository.findByIdOrFail(createdCommentId);

    const mappedComment = mapToCommentViewModel(createdComment);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedComment);
};
