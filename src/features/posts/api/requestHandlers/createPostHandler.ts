import { ObjectId } from 'mongodb';
import { type Response } from 'express';
import { type RequestWithBody } from '../../../shared/types';
import { CreateUpdatePostInputModel, PostViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { postsRepository } from '../../repository';
import { blogsRepository } from '../../../blogs/repository';
import { mapToPostViewModel } from '../mappers';

export const createPostHandler = async (
    req: RequestWithBody<CreateUpdatePostInputModel>,
    res: Response<PostViewModel>
) => {
    try {
        const payload = req.body;

        // we are checking blog existence in the middleware
        // so we are 100% sure that the blog exists
        // bad pattern, in future we will do this in use-case
        const blogName = (await blogsRepository.findById(new ObjectId(payload.blogId)))?.name!;
        const createdPost = await postsRepository.create(blogName, payload);

        const mappedPost = mapToPostViewModel(createdPost);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedPost);
    } catch (e: unknown) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }
};
