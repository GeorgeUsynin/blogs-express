import { type Response } from 'express';
import { type RequestWithBody } from '../../../../core/types';
import { CreateUpdatePostInputModel, PostViewModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToPostViewModel } from '../mappers';
import { postsService } from '../../application';
import { asyncHandler } from '../../../../core/helpers';

export const createPostHandler = asyncHandler(
    async (req: RequestWithBody<CreateUpdatePostInputModel>, res: Response<PostViewModel>) => {
        const payload = req.body;

        const createdPostId = await postsService.create(payload);

        const createdPost = await postsService.findByIdOrFail(createdPostId);

        const mappedPost = mapToPostViewModel(createdPost);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedPost);
    }
);
