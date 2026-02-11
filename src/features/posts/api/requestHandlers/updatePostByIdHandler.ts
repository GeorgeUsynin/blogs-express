import { type Response } from 'express';
import { RequestWithParamsAndBody } from '../../../../core/types';
import { CreateUpdatePostInputModel, PostViewModel, URIParamsPostModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { postsService } from '../../application';
import { asyncHandler } from '../../../../core/helpers';

export const updatePostByIdHandler = asyncHandler(
    async (
        req: RequestWithParamsAndBody<URIParamsPostModel, CreateUpdatePostInputModel>,
        res: Response<PostViewModel>
    ) => {
        const id = req.params.id;
        const payload = req.body;

        await postsService.updateById(id, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }
);
