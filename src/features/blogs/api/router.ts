import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';
import * as Validators from './groupedValidators';

export const BlogsRouter = Router();

const BlogsController = {
    getAllBlogs: RequestHandlers.getAllBlogsHandler,
    getBlogById: RequestHandlers.getBlogByIdHandler,
    createBlog: RequestHandlers.createBlogHandler,
    updateBlogById: RequestHandlers.updateBlogByIdHandler,
    deleteBlogById: RequestHandlers.deleteBlogByIdHandler,
};

BlogsRouter.get('/', BlogsController.getAllBlogs);
BlogsRouter.get('/:id', ...Validators.getByIdValidators, BlogsController.getBlogById);
BlogsRouter.post('/', ...Validators.postValidators, BlogsController.createBlog);
BlogsRouter.put('/:id', ...Validators.updateValidators, BlogsController.updateBlogById);
BlogsRouter.delete('/:id', ...Validators.deleteValidators, BlogsController.deleteBlogById);
