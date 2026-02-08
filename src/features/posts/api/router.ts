import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';

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
PostsRouter.post('/', PostsController.createPost);
PostsRouter.put('/:id', PostsController.updatePostById);
PostsRouter.delete('/:id', PostsController.deletePostById);
