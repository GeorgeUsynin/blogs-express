import { type Request, type Response } from 'express';
import { URIParamsPostModel, PostViewModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToPostViewModel } from '../mappers';
import { postsQueryRepository } from '../../repository';

export const getPostByIdHandler = async (req: Request<URIParamsPostModel>, res: Response<PostViewModel>) => {
        const id = req.params.id;

        const foundPost = await postsQueryRepository.findByIdOrFail(id);

        const mappedPost = mapToPostViewModel(foundPost);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedPost);
    }
