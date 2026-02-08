import { type Request, type Response } from 'express';
import { PostViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { postsRepository } from '../../repository';

export const getAllPostsHandler = (req: Request, res: Response<PostViewModel[]>) => {
    const allPosts = postsRepository.findAll();

    res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
};
