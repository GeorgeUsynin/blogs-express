import { type Request, type Response } from 'express';
import { URIParamsPostModel, PostViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../share/constants';
import { postsRepository } from '../../repository';

export const getPostByIdHandler = (req: Request<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const id = req.params.id;

    const foundPost = postsRepository.findById(id);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.status(HTTP_STATUS_CODES.OK_200).send(foundPost);
};
