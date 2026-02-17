import { Router } from 'express';
import * as Validators from './validation';
import { CommentsController } from './controller';
import { container } from '../../../compositionRoot';

export const CommentsRouter = Router();

const commentsController: CommentsController = container.get(CommentsController);

CommentsRouter.get('/:id', ...Validators.getByIdValidators, commentsController.getCommentById.bind(commentsController));
CommentsRouter.put('/:id', ...Validators.updateValidators, commentsController.updateCommentById.bind(commentsController));
CommentsRouter.delete('/:id', ...Validators.deleteValidators, commentsController.deleteCommentById.bind(commentsController));
