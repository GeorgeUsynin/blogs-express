import { type Request, type Response } from 'express';
import { BlogViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { blogsRepository } from '../../repository';
import { mapToBlogViewModel } from '../mappers';

export const getAllBlogsHandler = async (req: Request, res: Response<BlogViewModel[]>) => {
    try {
        const blogs = await blogsRepository.findAll();

        const mappedBlogs = blogs.map(mapToBlogViewModel);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedBlogs);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
