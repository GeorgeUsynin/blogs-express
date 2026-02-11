import { type Response } from 'express';
import { RequestWithParamsAndBody } from '../../../../core/types';
import { CreateUpdateBlogInputModel, BlogViewModel, URIParamsBlogModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { blogsService } from '../../application';
import { errorsHandler } from '../../../../core/errors';

export const updateBlogByIdHandler = async (
    req: RequestWithParamsAndBody<URIParamsBlogModel, CreateUpdateBlogInputModel>,
    res: Response<BlogViewModel>
) => {
    try {
        const id = req.params.id;
        const payload = req.body;

        await blogsService.updateById(id, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
};
