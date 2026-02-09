import { ObjectId } from 'mongodb';
import { type Request, type Response } from 'express';
import { URIParamsBlogModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { blogsRepository } from '../../repository';

export const deleteBlogByIdHandler = async (req: Request<URIParamsBlogModel>, res: Response) => {
    try {
        const id = new ObjectId(req.params.id);

        const foundBlog = await blogsRepository.findById(id);

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
            return;
        }

        await blogsRepository.removeById(id);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
