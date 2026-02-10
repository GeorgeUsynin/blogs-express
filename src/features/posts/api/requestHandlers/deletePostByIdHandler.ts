import { ObjectId } from 'mongodb';
import { type Request, type Response } from 'express';
import { URIParamsPostModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { postsRepository } from '../../repository';

export const deletePostByIdHandler = async (req: Request<URIParamsPostModel>, res: Response) => {
    try {
        const id = new ObjectId(req.params.id);
        const foundPost = await postsRepository.findById(id);

        if (!foundPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
            return;
        }

        await postsRepository.removeById(id);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
