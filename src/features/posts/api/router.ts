import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandlers from './requestHandlers';
import { basicAuthMiddleware, errorMiddleware } from '../../shared/middlewares';
import { createUpdatePostValidationSchema } from '../validation';

const createUpdatePostValidators = [
    basicAuthMiddleware,
    checkSchema(createUpdatePostValidationSchema, ['body']),
    errorMiddleware,
];

export const PostsRouter = Router();

const PostsController = {
    getAllPosts: RequestHandlers.getAllPostsHandler,
    getPostById: RequestHandlers.getPostByIdHandler,
    createPost: RequestHandlers.createPostHandler,
    updatePostById: RequestHandlers.updatePostByIdHandler,
    deletePostById: RequestHandlers.deletePostByIdHandler,
};

PostsRouter.get('/', PostsController.getAllPosts);
PostsRouter.get('/:id', PostsController.getPostById);
PostsRouter.post('/', ...createUpdatePostValidators, PostsController.createPost);
PostsRouter.put('/:id', ...createUpdatePostValidators, PostsController.updatePostById);
PostsRouter.delete('/:id', basicAuthMiddleware, PostsController.deletePostById);
