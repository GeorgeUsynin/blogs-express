import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';

export const BlogsRouter = Router();

const BlogsController = {
    getAllBlogs: RequestHandlers.getAllBlogsHandler,
    getBlogById: RequestHandlers.getBlogByIdHandler,
    createBlog: RequestHandlers.createBlogHandler,
    updateBlogById: RequestHandlers.updateBlogByIdHandler,
    deleteBlogById: RequestHandlers.deleteBlogByIdHandler,
};

BlogsRouter.get('/', BlogsController.getAllBlogs);
BlogsRouter.get('/:id', BlogsController.getBlogById);
BlogsRouter.post('/', BlogsController.createBlog);
BlogsRouter.put('/:id', BlogsController.updateBlogById);
BlogsRouter.delete('/:id', BlogsController.deleteBlogById);
