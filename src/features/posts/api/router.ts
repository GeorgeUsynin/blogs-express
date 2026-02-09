import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';
import * as Validators from './groupedValidators';

export const PostsRouter = Router();

const PostsController = {
    getAllPosts: RequestHandlers.getAllPostsHandler,
    getPostById: RequestHandlers.getPostByIdHandler,
    createPost: RequestHandlers.createPostHandler,
    updatePostById: RequestHandlers.updatePostByIdHandler,
    deletePostById: RequestHandlers.deletePostByIdHandler,
};

PostsRouter.get('/', PostsController.getAllPosts);
PostsRouter.get('/:id', ...Validators.getByIdValidators, PostsController.getPostById);
PostsRouter.post('/', ...Validators.postValidators, PostsController.createPost);
PostsRouter.put('/:id', ...Validators.updateValidators, PostsController.updatePostById);
PostsRouter.delete('/:id', ...Validators.deleteValidators, PostsController.deletePostById);
