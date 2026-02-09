import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandlers from './requestHandlers';
import { basicAuthMiddleware, errorMiddleware } from '../../shared/middlewares';
import { createUpdatePostValidationSchema } from '../validation';
import { objectIdValidation } from '../../shared/validation';

const postBodyValidator = checkSchema(createUpdatePostValidationSchema, ['body']);

export const PostsRouter = Router();

const PostsController = {
    getAllPosts: RequestHandlers.getAllPostsHandler,
    getPostById: RequestHandlers.getPostByIdHandler,
    createPost: RequestHandlers.createPostHandler,
    updatePostById: RequestHandlers.updatePostByIdHandler,
    deletePostById: RequestHandlers.deletePostByIdHandler,
};

PostsRouter.get('/', PostsController.getAllPosts);
PostsRouter.get('/:id', objectIdValidation, errorMiddleware, PostsController.getPostById);
PostsRouter.post('/', basicAuthMiddleware, postBodyValidator, errorMiddleware, PostsController.createPost);
PostsRouter.put(
    '/:id',
    basicAuthMiddleware,
    objectIdValidation,
    postBodyValidator,
    errorMiddleware,
    PostsController.updatePostById
);
PostsRouter.delete('/:id', basicAuthMiddleware, objectIdValidation, errorMiddleware, PostsController.deletePostById);
