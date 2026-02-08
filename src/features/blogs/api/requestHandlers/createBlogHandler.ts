import { type Response } from 'express';
import { type RequestWithBody } from '../../../shared/types';
import { CreateUpdateBlogInputModel, BlogViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { blogsRepository } from '../../repository';

export const createBlogHandler = (req: RequestWithBody<CreateUpdateBlogInputModel>, res: Response<BlogViewModel>) => {
    const payload = req.body;

    const createdBlog = blogsRepository.create(payload);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(createdBlog);
};
