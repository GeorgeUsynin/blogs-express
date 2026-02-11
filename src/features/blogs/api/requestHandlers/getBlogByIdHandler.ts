import { type Request, type Response } from 'express';
import { URIParamsBlogModel, BlogViewModel } from '../../api/models';
import { HTTP_STATUS_CODES } from '../../../../core/constants';
import { mapToBlogViewModel } from '../mappers';
import { asyncHandler } from '../../../../core/helpers';
import { blogsQueryRepository } from '../../repository';

export const getBlogByIdHandler = asyncHandler(
    async (req: Request<URIParamsBlogModel>, res: Response<BlogViewModel>) => {
        const id = req.params.id;

        const foundBlog = await blogsQueryRepository.findByIdOrFail(id);

        const mappedBlog = mapToBlogViewModel(foundBlog);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedBlog);
    }
);
