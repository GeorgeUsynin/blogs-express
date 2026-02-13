import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { SETTINGS } from '../../../core/settings';
import { UnauthorizedError } from '../../../core/errors';

interface IJwtPayload extends JwtPayload {
    userId: string;
}

export const jwtService = {
    createJwtToken(userId: string) {
        const token = jwt.sign({ userId }, SETTINGS.JWT_SECRET!, {
            expiresIn: SETTINGS.JWT_ACCESS_TOKEN_EXPIRATION_IN_HOURS,
        });
        return token;
    },

    verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, SETTINGS.JWT_SECRET!) as IJwtPayload;
            return decoded;
        } catch (e: unknown) {
            if (e instanceof JsonWebTokenError) {
                throw new UnauthorizedError(e.message, e.name);
            }

            throw e;
        }
    },
};
