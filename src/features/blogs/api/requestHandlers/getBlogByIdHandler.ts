import { ObjectId } from 'mongodb';
import { type Request, type Response } from 'express';
import { URIParamsBlogModel, BlogViewModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { blogsRepository } from '../../repository';
import { mapToBlogViewModel } from '../mappers';

export const getBlogByIdHandler = async (req: Request<URIParamsBlogModel>, res: Response<BlogViewModel>) => {
    try {
        const id = new ObjectId(req.params.id);

        const foundBlog = await blogsRepository.findById(id);

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
            return;
        }

        const mappedBlog = mapToBlogViewModel(foundBlog);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedBlog);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
