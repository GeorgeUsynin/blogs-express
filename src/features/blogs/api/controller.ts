import { inject, injectable } from 'inversify';
import { type Request, type Response } from 'express';
import { matchedData } from 'express-validator';
import {
    type RequestWithBody,
    type RequestWithParamsAndBody,
    type RequestWithParamsAndQuery,
    type RequestWithQuery,
} from '../../../core/types';
import {
    type BlogViewModel,
    type URIParamsBlogModel,
    type BlogListPaginatedOutput,
    type BlogQueryInput,
    type CreateUpdateBlogInputModel,
} from './models';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers';
import { BlogsQueryRepository } from '../repository/queryRepository';
import { mapToBlogListPaginatedOutput, mapToBlogViewModel } from './mappers';
import { HTTP_STATUS_CODES } from '../../../core/constants';
import {
    type CreateUpdatePostInputModel,
    type PostViewModel,
    type PostListPaginatedOutput,
    type PostQueryInput,
} from '../../posts/api/models';
import { mapToPostListPaginatedOutput, mapToPostViewModel } from '../../posts/api/mappers';
import { BlogsService } from '../application';
import { PostsService } from '../../posts/application';
import { PostsQueryRepository } from '../../posts/repository/queryRepository';
import { BlogNotFoundError } from '../../../core/errors';

@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsQueryRepository)
        private blogsQueryRepository: BlogsQueryRepository,
        @inject(BlogsService)
        private blogsService: BlogsService,
        @inject(PostsService)
        private postsService: PostsService,
        @inject(PostsQueryRepository)
        private postsQueryRepository: PostsQueryRepository
    ) {}

    async getAllBlogs(req: RequestWithQuery<Partial<BlogQueryInput>>, res: Response<BlogListPaginatedOutput>) {
        const sanitizedQuery = matchedData<BlogQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const { items, totalCount } = await this.blogsQueryRepository.findMany(queryInput);

        const blogsListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HTTP_STATUS_CODES.OK_200).send(blogsListOutput);
    }

    async getBlogById(req: Request<URIParamsBlogModel>, res: Response<BlogViewModel>) {
        const id = req.params.id;

        const foundBlog = await this.findBlogByIdOrThrowNotFound(id);

        const mappedBlog = mapToBlogViewModel(foundBlog);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedBlog);
    }

    async getPostsByBlogId(
        req: RequestWithParamsAndQuery<URIParamsBlogModel, Partial<PostQueryInput>>,
        res: Response<PostListPaginatedOutput>
    ) {
        const blogId = req.params.id;

        await this.findBlogByIdOrThrowNotFound(blogId);

        const sanitizedQuery = matchedData<PostQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const { items, totalCount } = await this.postsQueryRepository.findManyByBlogId(blogId, queryInput);

        const blogsListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HTTP_STATUS_CODES.OK_200).send(blogsListOutput);
    }

    async createBlog(req: RequestWithBody<CreateUpdateBlogInputModel>, res: Response<BlogViewModel>) {
        const payload = req.body;

        const createdBlog = await this.blogsService.create(payload);

        const mappedBlog = mapToBlogViewModel(createdBlog);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedBlog);
    }

    async createPostForBlogByBlogId(
        req: RequestWithParamsAndBody<URIParamsBlogModel, Omit<CreateUpdatePostInputModel, 'blogId'>>,
        res: Response<PostViewModel>
    ) {
        const id = req.params.id;
        const payload = req.body;

        const createdPost = await this.postsService.create({ ...payload, blogId: id });

        const mappedPost = mapToPostViewModel(createdPost);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedPost);
    }

    async updateBlogById(
        req: RequestWithParamsAndBody<URIParamsBlogModel, CreateUpdateBlogInputModel>,
        res: Response<BlogViewModel>
    ) {
        const id = req.params.id;
        const payload = req.body;

        await this.blogsService.updateById(id, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }

    async deleteBlogById(req: Request<URIParamsBlogModel>, res: Response) {
        const id = req.params.id;

        await this.blogsService.removeById(id);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }

    private async findBlogByIdOrThrowNotFound(id: string) {
        const blog = await this.blogsQueryRepository.findById(id);
        if (!blog) throw new BlogNotFoundError();
        return blog;
    }
}
