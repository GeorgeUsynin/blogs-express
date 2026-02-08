import { type Response } from 'express';
import { type RequestWithBody } from '../../../shared/types';
import { CreateUpdatePostInputModel, PostViewModel } from '../../models';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { postsRepository } from '../../repository';
import { blogsRepository } from '../../../blogs/repository';

export const createPostHandler = (req: RequestWithBody<CreateUpdatePostInputModel>, res: Response<PostViewModel>) => {
    const payload = req.body;

    // we are checking blog existence in the middleware
    // so we are 100% sure that the blog exists
    // bad pattern, in future we will do this in use-case
    const blogName = blogsRepository.findById(payload.blogId)?.name!;
    const createdPost = postsRepository.create(blogName, payload);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(createdPost);
};
