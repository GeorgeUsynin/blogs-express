import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';
import { SETTINGS } from '../../../core/settings';
import { UnauthorizedError } from '../../../core/errors';

export const jwtService = {
    createJwtToken(userId: string) {
        const token = jwt.sign({ userId }, SETTINGS.JWT_SECRET!, { expiresIn: '1h' });
        return token;
    },

    verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, SETTINGS.JWT_SECRET!);
            return decoded;
        } catch (e: unknown) {
            if (e instanceof JsonWebTokenError) {
                throw new UnauthorizedError(e.message, {
                    name: e.name,
                    message: e.message,
                    ...(e instanceof TokenExpiredError ? { expiredAt: e.expiredAt } : {}),
                    ...(e instanceof NotBeforeError ? { date: e.date } : {}),
                });
            }

            throw e;
        }
    },
};
