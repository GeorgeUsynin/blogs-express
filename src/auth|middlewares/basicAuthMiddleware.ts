import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../core/constants';
import { SETTINGS } from '../core/settings';

const ADMIN_USERNAME = SETTINGS.CREDENTIALS.LOGIN;
const ADMIN_PASSWORD = SETTINGS.CREDENTIALS.PASSWORD;

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string;

    if (!auth) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const [authType, token] = auth.split(' ');

    if (authType !== 'Basic') {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const [username, password] = Buffer.from(token, 'base64').toString('utf-8').split(':');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    next();
};
