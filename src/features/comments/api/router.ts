import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';
import * as Validators from './validation';

export const CommentsRouter = Router();

const CommentsController = {
    getCommentById: RequestHandlers.getCommentByIdHandler,
    updateCommentById: RequestHandlers.updateCommentByIdHandler,
    deleteCommentById: RequestHandlers.deleteCommentByIdHandler,
};

CommentsRouter.get('/:id', ...Validators.getByIdValidators, CommentsController.getCommentById);
CommentsRouter.put('/:id', ...Validators.updateValidators, CommentsController.updateCommentById);
CommentsRouter.delete('/:id', ...Validators.deleteValidators, CommentsController.deleteCommentById);
