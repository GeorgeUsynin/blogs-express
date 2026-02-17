import { Router } from 'express';
import * as Validators from './validation';
import { PostsController } from './controller';
import { container } from '../../../compositionRoot';

export const PostsRouter = Router();

const postsController: PostsController = container.get(PostsController);

PostsRouter.get('/', ...Validators.getValidators, postsController.getAllPosts.bind(postsController));
PostsRouter.get('/:id', ...Validators.getByIdValidators, postsController.getPostById.bind(postsController));
PostsRouter.get(
    '/:id/comments',
    ...Validators.getAllCommentsByPostIdValidator,
    postsController.getAllCommentsByPostId.bind(postsController)
);
PostsRouter.post(
    '/:id/comments',
    ...Validators.createCommentByPostIdValidator,
    postsController.createCommentByPostId.bind(postsController)
);
PostsRouter.post('/', ...Validators.postValidators, postsController.createPost.bind(postsController));
PostsRouter.put('/:id', ...Validators.updateValidators, postsController.updatePostById.bind(postsController));
PostsRouter.delete('/:id', ...Validators.deleteValidators, postsController.deletePostById.bind(postsController));
