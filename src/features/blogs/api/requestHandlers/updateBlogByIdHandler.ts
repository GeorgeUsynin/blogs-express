import { ObjectId } from 'mongodb';
import { type Response } from 'express';
import { RequestWithParamsAndBody } from '../../../../core/types';
import { CreateUpdateBlogInputModel, BlogViewModel, URIParamsBlogModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { blogsRepository } from '../../repository';

export const updateBlogByIdHandler = async (
    req: RequestWithParamsAndBody<URIParamsBlogModel, CreateUpdateBlogInputModel>,
    res: Response<BlogViewModel>
) => {
    try {
        const id = new ObjectId(req.params.id);
        const payload = req.body;

        const foundBlog = await blogsRepository.findById(id);

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
            return;
        }

        await blogsRepository.updateById(id, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
