import { type Request, type Response } from 'express';
import { BlogViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../share/constants';
import { blogsRepository } from '../../repository';

export const getAllBlogsHandler = (req: Request, res: Response<BlogViewModel[]>) => {
    const allBlogs = blogsRepository.findAll();

    res.status(HTTP_STATUS_CODES.OK_200).send(allBlogs);
};
