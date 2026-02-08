import { type Request, type Response } from 'express';
import { URIParamsBlogModel, BlogViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../share/constants';
import { blogsRepository } from '../../repository';

export const getBlogByIdHandler = (req: Request<URIParamsBlogModel>, res: Response<BlogViewModel>) => {
    const id = req.params.id;

    const foundBlog = blogsRepository.findById(id);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.status(HTTP_STATUS_CODES.OK_200).send(foundBlog);
};
