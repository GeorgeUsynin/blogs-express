import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';
import * as Validators from './validation';

export const PostsRouter = Router();

const PostsController = {
    getAllPosts: RequestHandlers.getAllPostsHandler,
    getPostById: RequestHandlers.getPostByIdHandler,
    getAllCommentsByPostId: RequestHandlers.getAllCommentsByPostIdHandler,
    createCommentByPostId: RequestHandlers.createCommentByPostIdHandler,
    createPost: RequestHandlers.createPostHandler,
    updatePostById: RequestHandlers.updatePostByIdHandler,
    deletePostById: RequestHandlers.deletePostByIdHandler,
};

PostsRouter.get('/', ...Validators.getValidators, PostsController.getAllPosts);
PostsRouter.get('/:id', ...Validators.getByIdValidators, PostsController.getPostById);
PostsRouter.get('/:id/comments', ...Validators.getAllCommentsByPostIdValidator, PostsController.getAllCommentsByPostId);
PostsRouter.post('/:id/comments', ...Validators.createCommentByPostIdValidator, PostsController.createCommentByPostId);
PostsRouter.post('/', ...Validators.postValidators, PostsController.createPost);
PostsRouter.put('/:id', ...Validators.updateValidators, PostsController.updatePostById);
PostsRouter.delete('/:id', ...Validators.deleteValidators, PostsController.deletePostById);
