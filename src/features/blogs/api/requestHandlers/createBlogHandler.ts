import { type Response } from 'express';
import { type RequestWithBody } from '../../../../core/types';
import { CreateUpdateBlogInputModel, BlogViewModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { blogsRepository } from '../../repository';
import { mapToBlogViewModel } from '../mappers';

export const createBlogHandler = async (
    req: RequestWithBody<CreateUpdateBlogInputModel>,
    res: Response<BlogViewModel>
) => {
    try {
        const payload = req.body;

        const createdBlog = await blogsRepository.create(payload);

        const mappedBlog = mapToBlogViewModel(createdBlog);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedBlog);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
