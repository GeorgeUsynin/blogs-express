import { ObjectId } from 'mongodb';
import { type Request, type Response } from 'express';
import { URIParamsPostModel, PostViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { postsRepository } from '../../repository';
import { mapToPostViewModel } from '../mappers';

export const getPostByIdHandler = async (req: Request<URIParamsPostModel>, res: Response<PostViewModel>) => {
    try {
        const id = new ObjectId(req.params.id);

        const foundPost = await postsRepository.findById(id);

        if (!foundPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
            return;
        }

        const mappedPost = mapToPostViewModel(foundPost);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedPost);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
