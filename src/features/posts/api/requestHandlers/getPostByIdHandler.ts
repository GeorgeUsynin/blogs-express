import { type Request, type Response } from 'express';
import { URIParamsPostModel, PostViewModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToPostViewModel } from '../mappers';
import { postsService } from '../../application';
import { asyncHandler } from '../../../../core/helpers';

export const getPostByIdHandler = asyncHandler(async (req: Request<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const id = req.params.id;

    const foundPost = await postsService.findByIdOrFail(id);

    const mappedPost = mapToPostViewModel(foundPost);

    res.status(HTTP_STATUS_CODES.OK_200).send(mappedPost);
});
