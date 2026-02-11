import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';
import * as Validators from './validation';

export const UsersRouter = Router();

const UsersController = {
    getAllUsers: RequestHandlers.getAllUsersHandler,
    createUser: RequestHandlers.createUserHandler,
    deleteUserById: RequestHandlers.deleteUserByIdHandler,
};

UsersRouter.get('/', ...Validators.getValidators, UsersController.getAllUsers);
UsersRouter.post('/', ...Validators.postValidators, UsersController.createUser);
UsersRouter.delete('/:id', ...Validators.deleteValidators, UsersController.deleteUserById);
