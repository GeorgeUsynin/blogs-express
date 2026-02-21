import { inject, injectable } from 'inversify';
import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../core/constants';
import { RequestWithParamsAndBody } from '../../../core/types';
import { mapToCommentViewModel } from './mappers';
import { CommentViewModel, CreateUpdateCommentInputModel, URIParamsCommentModel } from './models';
import { CommentsService } from '../application';
import { CommentsQueryRepository } from '../repository';
import { CommentNotFoundError } from '../../../core/errors';
import { CreateUpdateLikesStatusInputModel } from '../../likes/api/models';

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsService)
        private commentsService: CommentsService,
        @inject(CommentsQueryRepository)
        private commentsQueryRepository: CommentsQueryRepository
    ) {}

    async getCommentById(req: Request<URIParamsCommentModel>, res: Response<CommentViewModel>) {
        const userId = req.userId;
        const id = req.params.id;

        const foundComment = await this.commentsQueryRepository.findById(id, userId);

        if (!foundComment) {
            throw new CommentNotFoundError();
        }

        const mappedComment = mapToCommentViewModel(foundComment);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedComment);
    }

    async updateCommentById(
        req: RequestWithParamsAndBody<URIParamsCommentModel, CreateUpdateCommentInputModel>,
        res: Response<CommentViewModel>
    ) {
        const id = req.params.id;
        const userId = req.userId!;
        const payload = req.body;

        await this.commentsService.updateById(id, userId, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }

    async createUpdateCommentLikeStatusById(
        req: RequestWithParamsAndBody<URIParamsCommentModel, CreateUpdateLikesStatusInputModel>,
        res: Response
    ) {
        const userId = req.userId!;
        const commentId = req.params.id;
        const { likeStatus } = req.body;

        const commentLikeStatusAttributes = { commentId, userId, likeStatus };

        await this.commentsService.setCommentLikeStatusById(commentLikeStatusAttributes);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }

    async deleteCommentById(req: Request<URIParamsCommentModel>, res: Response) {
        const userId = req.userId!;
        const id = req.params.id;

        await this.commentsService.removeById(id, userId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }
}
