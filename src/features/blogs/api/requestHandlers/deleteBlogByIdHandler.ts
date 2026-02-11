import { type Request, type Response } from 'express';
import { URIParamsBlogModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { blogsService } from '../../application';
import { asyncHandler } from '../../../../core/helpers';

export const deleteBlogByIdHandler = asyncHandler(async (req: Request<URIParamsBlogModel>, res: Response) => {
    const id = req.params.id;

    await blogsService.removeById(id);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
});
