import { type Response } from 'express';
import { type RequestWithParamsAndBody } from '../../../../core/types';
import { URIParamsBlogModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { CreateUpdatePostInputModel, PostViewModel } from '../../../posts/api/models';
import { postsService } from '../../../posts/application';
import { mapToPostViewModel } from '../../../posts/api/mappers';
import { asyncHandler } from '../../../../core/helpers';
import { postsQueryRepository } from '../../../posts/repository';

export const createPostForBlogByBlogIdHandler = asyncHandler(
    async (
        req: RequestWithParamsAndBody<URIParamsBlogModel, Omit<CreateUpdatePostInputModel, 'blogId'>>,
        res: Response<PostViewModel>
    ) => {
        const id = req.params.id;
        const payload = req.body;

        const createdPostId = await postsService.create({ ...payload, blogId: id });

        const createdPost = await postsQueryRepository.findByIdOrFail(createdPostId);

        const mappedPost = mapToPostViewModel(createdPost);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedPost);
    }
);
