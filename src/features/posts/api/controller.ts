import { inject, injectable } from 'inversify';
import { type Request, type Response } from 'express';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers';
import {
    type RequestWithBody,
    type RequestWithParamsAndBody,
    type RequestWithParamsAndQuery,
    type RequestWithQuery,
} from '../../../core/types';
import { HTTP_STATUS_CODES } from '../../../core/constants';
import {
    PostListPaginatedOutput,
    PostQueryInput,
    PostViewModel,
    URIParamsPostModel,
    CreateUpdatePostInputModel,
} from './models';
import { mapToPostListPaginatedOutput, mapToPostViewModel } from './mappers';
import { PostsService } from '../application';
import { PostsQueryRepository } from '../repository/queryRepository';
import {
    CommentListPaginatedOutput,
    CommentQueryInput,
    CommentViewModel,
    CreateUpdateCommentInputModel,
} from '../../comments/api/models';
import { mapToCommentListPaginatedOutput, mapToCommentViewModel } from '../../comments/api/mappers';
import { CommentsService } from '../../comments/application';
import { CommentsQueryRepository } from '../../comments/repository/queryRepository';

@injectable()
export class PostsController {
    constructor(
        @inject(PostsService)
        private postsService: PostsService,
        @inject(PostsQueryRepository)
        private postsQueryRepository: PostsQueryRepository,
        @inject(CommentsService)
        private commentsService: CommentsService,
        @inject(CommentsQueryRepository)
        private commentsQueryRepository: CommentsQueryRepository
    ) {}

    async getAllPosts(req: RequestWithQuery<Partial<PostQueryInput>>, res: Response<PostListPaginatedOutput>) {
        const sanitizedQuery = matchedData<PostQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const { items, totalCount } = await this.postsQueryRepository.findMany(queryInput);

        const postsListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HTTP_STATUS_CODES.OK_200).send(postsListOutput);
    }

    async getPostById(req: Request<URIParamsPostModel>, res: Response<PostViewModel>) {
        const id = req.params.id;

        const foundPost = await this.postsQueryRepository.findByIdOrFail(id);

        const mappedPost = mapToPostViewModel(foundPost);

        res.status(HTTP_STATUS_CODES.OK_200).send(mappedPost);
    }

    async getAllCommentsByPostId(
        req: RequestWithParamsAndQuery<URIParamsPostModel, Partial<CommentQueryInput>>,
        res: Response<CommentListPaginatedOutput>
    ) {
        const postId = req.params.id;

        await this.postsQueryRepository.findByIdOrFail(postId);

        const sanitizedQuery = matchedData<CommentQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const { items, totalCount } = await this.commentsQueryRepository.findManyByPostId(postId, queryInput);

        const commentsListOutput = mapToCommentListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HTTP_STATUS_CODES.OK_200).send(commentsListOutput);
    }

    async createCommentByPostId(
        req: RequestWithParamsAndBody<URIParamsPostModel, CreateUpdateCommentInputModel>,
        res: Response<CommentViewModel>
    ) {
        const postId = req.params.id;
        const userId = req.userId!;
        const payload = req.body;

        const createdComment = await this.commentsService.create(postId, userId, payload);

        const mappedComment = mapToCommentViewModel(createdComment);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedComment);
    }

    async createPost(req: RequestWithBody<CreateUpdatePostInputModel>, res: Response<PostViewModel>) {
        const payload = req.body;

        const createdPost = await this.postsService.create(payload);

        const mappedPost = mapToPostViewModel(createdPost);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(mappedPost);
    }

    async updatePostById(
        req: RequestWithParamsAndBody<URIParamsPostModel, CreateUpdatePostInputModel>,
        res: Response<PostViewModel>
    ) {
        const id = req.params.id;
        const payload = req.body;

        await this.postsService.updateById(id, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }

    async deletePostById(req: Request<URIParamsPostModel>, res: Response) {
        const id = req.params.id;

        await this.postsService.removeById(id);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    }
}
