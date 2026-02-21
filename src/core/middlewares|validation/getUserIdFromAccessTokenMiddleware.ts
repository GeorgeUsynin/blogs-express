import { NextFunction, Request, Response } from 'express';
import { container } from '../../compositionRoot';
import { JwtProvider } from '../../features/auth/application';
import { UsersRepository } from '../../features/users/repository';

const jwtProvider: JwtProvider = container.get(JwtProvider);
const usersRepository: UsersRepository = container.get(UsersRepository);

export const getUserIdFromAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string;

    if (!auth) {
        return next();
    }

    const [authType, token] = auth.split(' ');

    if (authType !== 'Bearer') {
        return next();
    }

    const { userId } = jwtProvider.verifyToken<'access'>(token);

    const user = await usersRepository.findById(userId);

    if (!user) {
        return next();
    }

    req.userId = userId;

    return next();
};
