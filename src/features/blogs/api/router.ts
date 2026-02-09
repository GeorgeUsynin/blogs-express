import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandlers from './requestHandlers';
import { basicAuthMiddleware, errorMiddleware } from '../../shared/middlewares';
import { createUpdateBlogValidationSchema } from '../validation';
import { objectIdValidation } from '../../shared/validation';

const blogBodyValidator = checkSchema(createUpdateBlogValidationSchema, ['body']);

export const BlogsRouter = Router();

const BlogsController = {
    getAllBlogs: RequestHandlers.getAllBlogsHandler,
    getBlogById: RequestHandlers.getBlogByIdHandler,
    createBlog: RequestHandlers.createBlogHandler,
    updateBlogById: RequestHandlers.updateBlogByIdHandler,
    deleteBlogById: RequestHandlers.deleteBlogByIdHandler,
};

BlogsRouter.get('/', BlogsController.getAllBlogs);
BlogsRouter.get('/:id', objectIdValidation, errorMiddleware, BlogsController.getBlogById);
BlogsRouter.post('/', basicAuthMiddleware, blogBodyValidator, errorMiddleware, BlogsController.createBlog);
BlogsRouter.put(
    '/:id',
    basicAuthMiddleware,
    objectIdValidation,
    blogBodyValidator,
    errorMiddleware,
    BlogsController.updateBlogById
);
BlogsRouter.delete('/:id', basicAuthMiddleware, objectIdValidation, errorMiddleware, BlogsController.deleteBlogById);
