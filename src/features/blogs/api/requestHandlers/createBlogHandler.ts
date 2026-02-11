import { type Response } from 'express';
import { type RequestWithBody } from '../../../../core/types';
import { CreateUpdateBlogInputModel, BlogViewModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToBlogViewModel } from '../mappers';
import { blogsService } from '../../application';
import { asyncHandler } from '../../../../core/helpers';

export const createBlogHandler = asyncHandler(async (
    req: RequestWithBody<CreateUpdateBlogInputModel>,
    res: Response<BlogViewModel>
) => {
    const payload = req.body;

    const createdBlogId = await blogsService.create(payload);

    const createdBlog = await blogsService.findByIdOrFail(createdBlogId);

    const mappedBlog = mapToBlogViewModel(createdBlog);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedBlog);
});
