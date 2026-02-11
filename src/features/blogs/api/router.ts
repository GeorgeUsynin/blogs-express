import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';
import * as Validators from './validation';

export const BlogsRouter = Router();

const BlogsController = {
    getAllBlogs: RequestHandlers.getAllBlogsHandler,
    getBlogById: RequestHandlers.getBlogByIdHandler,
    getPostsByBlogId: RequestHandlers.getPostsByBlogIdHandler,
    createBlog: RequestHandlers.createBlogHandler,
    createPostForBlogByBlogId: RequestHandlers.createPostForBlogByBlogIdHandler,
    updateBlogById: RequestHandlers.updateBlogByIdHandler,
    deleteBlogById: RequestHandlers.deleteBlogByIdHandler,
};

BlogsRouter.get('/', ...Validators.getValidators, BlogsController.getAllBlogs);
BlogsRouter.get('/:id', ...Validators.getByIdValidators, BlogsController.getBlogById);
BlogsRouter.get('/:id/posts', ...Validators.getPostsByBlogIdValidators, BlogsController.getPostsByBlogId);
BlogsRouter.post('/', ...Validators.postValidators, BlogsController.createBlog);
BlogsRouter.post(
    '/:id/posts',
    ...Validators.createPostForBlogByBlogIdValidators,
    BlogsController.createPostForBlogByBlogId
);
BlogsRouter.put('/:id', ...Validators.updateValidators, BlogsController.updateBlogById);
BlogsRouter.delete('/:id', ...Validators.deleteValidators, BlogsController.deleteBlogById);
