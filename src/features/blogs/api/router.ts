import { Router } from 'express';
import * as Validators from './validation';
import { BlogsController } from './controller';
import { container } from '../../../compositionRoot';

export const BlogsRouter = Router();

const blogsController: BlogsController = container.get(BlogsController);

BlogsRouter.get('/', ...Validators.getValidators, blogsController.getAllBlogs.bind(blogsController));
BlogsRouter.get('/:id', ...Validators.getByIdValidators, blogsController.getBlogById.bind(blogsController));
BlogsRouter.get(
    '/:id/posts',
    ...Validators.getPostsByBlogIdValidators,
    blogsController.getPostsByBlogId.bind(blogsController)
);
BlogsRouter.post('/', ...Validators.postValidators, blogsController.createBlog.bind(blogsController));
BlogsRouter.post(
    '/:id/posts',
    ...Validators.createPostForBlogByBlogIdValidators,
    blogsController.createPostForBlogByBlogId.bind(blogsController)
);
BlogsRouter.put('/:id', ...Validators.updateValidators, blogsController.updateBlogById.bind(blogsController));
BlogsRouter.delete('/:id', ...Validators.deleteValidators, blogsController.deleteBlogById.bind(blogsController));
