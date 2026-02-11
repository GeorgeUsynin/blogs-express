import { type Response } from 'express';
import { RequestWithParamsAndBody } from '../../../../core/types';
import { CreateUpdateBlogInputModel, BlogViewModel, URIParamsBlogModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { blogsService } from '../../application';
import { asyncHandler } from '../../../../core/helpers';

export const updateBlogByIdHandler = asyncHandler(
    async (
        req: RequestWithParamsAndBody<URIParamsBlogModel, CreateUpdateBlogInputModel>,
        res: Response<BlogViewModel>
    ) => {
        const id = req.params.id;
        const payload = req.body;

        await blogsService.updateById(id, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }
);
