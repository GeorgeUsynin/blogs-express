import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../core/constants';
import { JwtProvider } from '../features/auth/application';
import { UsersRepository } from '../features/users/repository';
import { container } from '../compositionRoot';

const jwtProvider: JwtProvider = container.get(JwtProvider);
const usersRepository: UsersRepository = container.get(UsersRepository);

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string;

    if (!auth) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const [authType, token] = auth.split(' ');

    if (authType !== 'Bearer') {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const { userId } = jwtProvider.verifyToken<'access'>(token);

    const user = await usersRepository.findById(userId);

    if (!user) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    req.userId = userId;

    next();
};
