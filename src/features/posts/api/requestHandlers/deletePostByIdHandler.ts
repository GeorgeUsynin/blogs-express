import { type Request, type Response } from 'express';
import { URIParamsPostModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { postsService } from '../../application';
import { asyncHandler } from '../../../../core/helpers';

export const deletePostByIdHandler = asyncHandler(async (req: Request<URIParamsPostModel>, res: Response) => {
    const id = req.params.id;

    await postsService.removeById(id);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
});
