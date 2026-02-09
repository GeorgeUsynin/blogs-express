import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandlers from './requestHandlers';
import { basicAuthMiddleware, errorMiddleware } from '../../shared/middlewares';
import { createUpdateBlogValidationSchema } from '../validation';
import { objectIdValidation } from '../../shared/validation';

const createUpdateBlogValidators = [checkSchema(createUpdateBlogValidationSchema, ['body']), errorMiddleware];

export const BlogsRouter = Router();

const BlogsController = {
    getAllBlogs: RequestHandlers.getAllBlogsHandler,
    getBlogById: RequestHandlers.getBlogByIdHandler,
    createBlog: RequestHandlers.createBlogHandler,
    updateBlogById: RequestHandlers.updateBlogByIdHandler,
    deleteBlogById: RequestHandlers.deleteBlogByIdHandler,
};

BlogsRouter.get('/', BlogsController.getAllBlogs);
BlogsRouter.get('/:id', objectIdValidation, BlogsController.getBlogById);
BlogsRouter.post('/', basicAuthMiddleware, ...createUpdateBlogValidators, BlogsController.createBlog);
BlogsRouter.put(
    '/:id',
    basicAuthMiddleware,
    objectIdValidation,
    ...createUpdateBlogValidators,
    BlogsController.updateBlogById
);
BlogsRouter.delete('/:id', basicAuthMiddleware, objectIdValidation, BlogsController.deleteBlogById);
