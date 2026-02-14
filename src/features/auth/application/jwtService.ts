import jwt, { JsonWebTokenError, JwtPayload, SignOptions } from 'jsonwebtoken';
import { SETTINGS } from '../../../core/settings';
import { UnauthorizedError } from '../../../core/errors';

type JwtKind = 'access' | 'refresh';

type TPayload<T extends JwtKind> = T extends 'access'
    ? { userId: string }
    : T extends 'refresh'
      ? { deviceId: string; userId: string }
      : never;

type IJwtPayload<T extends JwtKind> = T extends 'access'
    ? JwtPayload & TPayload<T>
    : T extends 'refresh'
      ? JwtPayload & TPayload<T>
      : never;

export const jwtService = {
    createJwtToken<T extends JwtKind>(payload: TPayload<T>, expiresIn: SignOptions['expiresIn']) {
        const token = jwt.sign(payload, SETTINGS.JWT_SECRET!, {
            expiresIn,
        });
        return token;
    },

    verifyToken<T extends JwtKind>(token: string) {
        try {
            const decoded = jwt.verify(token, SETTINGS.JWT_SECRET!) as IJwtPayload<T>;
            return decoded;
        } catch (e: unknown) {
            if (e instanceof JsonWebTokenError) {
                throw new UnauthorizedError(e.message, e.name);
            }

            throw e;
        }
    },
};
