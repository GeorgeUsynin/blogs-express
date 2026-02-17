import { Router } from 'express';
import * as Validators from './validation';
import { UsersController } from './controller';
import { container } from '../../../compositionRoot';

export const UsersRouter = Router();

const usersController: UsersController = container.get(UsersController);

UsersRouter.get('/', ...Validators.getValidators, usersController.getAllUsers.bind(usersController));
UsersRouter.post('/', ...Validators.postValidators, usersController.createUser.bind(usersController));
UsersRouter.delete('/:id', ...Validators.deleteValidators, usersController.deleteUserById.bind(usersController));
