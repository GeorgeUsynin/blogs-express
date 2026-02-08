import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandlers from './requestHandlers';
import { basicAuthMiddleware, errorMiddleware } from '../../share/middlewares';
import { createUpdateBlogValidationSchema } from '../validation';

const createUpdateBlogValidators = [
    basicAuthMiddleware,
    checkSchema(createUpdateBlogValidationSchema, ['body']),
    errorMiddleware,
];

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
BlogsRouter.post('/', ...createUpdateBlogValidators, BlogsController.createBlog);
BlogsRouter.put('/:id', ...createUpdateBlogValidators, BlogsController.updateBlogById);
BlogsRouter.delete('/:id', basicAuthMiddleware, BlogsController.deleteBlogById);
