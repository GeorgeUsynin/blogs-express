import { type Response } from 'express';
import { RequestWithParamsAndBody } from '../../../share/types';
import { CreateUpdateBlogInputModel, BlogViewModel, URIParamsBlogModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../share/constants';
import { blogsRepository } from '../../repository';

export const updateBlogByIdHandler = (
    req: RequestWithParamsAndBody<URIParamsBlogModel, CreateUpdateBlogInputModel>,
    res: Response<BlogViewModel>
) => {
    const id = req.params.id;
    const payload = req.body;

    const foundBlog = blogsRepository.findById(id);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    blogsRepository.update(id, payload);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
