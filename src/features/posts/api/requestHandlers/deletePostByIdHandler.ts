import { type Request, type Response } from 'express';
import { URIParamsPostModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { postsRepository } from '../../repository';

export const deletePostByIdHandler = (req: Request<URIParamsPostModel>, res: Response) => {
    const id = req.params.id;

    const foundPost = postsRepository.findById(id);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    postsRepository.removeById(id);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
