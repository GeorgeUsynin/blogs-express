import { type Request, type Response } from 'express';
import { PostViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { postsRepository } from '../../repository';
import { mapToPostViewModel } from '../mappers';

export const getAllPostsHandler = async (req: Request, res: Response<PostViewModel[]>) => {
    try {
        const posts = await postsRepository.findAll();

        const mappedPosts = posts.map(mapToPostViewModel);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedPosts);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
