import { type Response } from 'express';
import { RequestWithParamsAndBody } from '../../../shared/types';
import { CreateUpdatePostInputModel, PostViewModel, URIParamsPostModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { postsRepository } from '../../repository';

export const updatePostByIdHandler = (
    req: RequestWithParamsAndBody<URIParamsPostModel, CreateUpdatePostInputModel>,
    res: Response<PostViewModel>
) => {
    const id = req.params.id;
    const payload = req.body;

    const foundPost = postsRepository.findById(id);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    postsRepository.update(id, payload);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
