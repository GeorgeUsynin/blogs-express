import { type Request, type Response } from 'express';
import { URIParamsBlogModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { blogsRepository } from '../../repository';

export const deleteBlogByIdHandler = (req: Request<URIParamsBlogModel>, res: Response) => {
    const id = req.params.id;

    const foundBlog = blogsRepository.findById(id);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    blogsRepository.removeById(id);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
