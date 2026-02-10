import { ObjectId } from 'mongodb';
import { type Response } from 'express';
import { RequestWithParamsAndBody } from '../../../../core/types';
import { CreateUpdatePostInputModel, PostViewModel, URIParamsPostModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { postsRepository } from '../../repository';

export const updatePostByIdHandler = async (
    req: RequestWithParamsAndBody<URIParamsPostModel, CreateUpdatePostInputModel>,
    res: Response<PostViewModel>
) => {
    try {
        const id = new ObjectId(req.params.id);
        const payload = req.body;

        const foundPost = await postsRepository.findById(id);

        if (!foundPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
            return;
        }

        await postsRepository.updateById(id, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
