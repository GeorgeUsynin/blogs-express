import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Express, Request, Response } from 'express';
import {
    AuthRouter,
    BlogsRouter,
    PostsRouter,
    CommentsRouter,
    TestRouter,
    UsersRouter,
    SecurityDevicesRouter,
} from './features';
import { HTTP_STATUS_CODES, ROUTES } from './core/constants';
import { setupSwagger } from './core/swagger';
import { globalErrorMiddleware } from './core/errors';

export const setupApp = (app: Express) => {
    // Parses incoming cookies into req.cookies
    app.use(cookieParser());

    // Parses incoming requests with JSON payloads
    // and makes the data available in req.body
    app.use(express.json());

    // Enables Cross-Origin Resource Sharing (CORS)
    // allowing requests from different origins (domains)
    app.use(cors());

    // Trust reverse proxy headers (X-Forwarded-*) to get real client IP and protocol
    app.set('trust proxy', true);

    app.use(ROUTES.AUTH, AuthRouter);
    app.use(ROUTES.BLOGS, BlogsRouter);
    app.use(ROUTES.POSTS, PostsRouter);
    app.use(ROUTES.COMMENTS, CommentsRouter);
    app.use(ROUTES.USERS, UsersRouter);
    app.use(ROUTES.SECURITY_DEVICES, SecurityDevicesRouter);
    app.use(ROUTES.TESTING, TestRouter);

    app.get('/', (req: Request, res: Response) => {
        res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0' });
    });

    setupSwagger(app);

    app.use(globalErrorMiddleware);

    return app;
};
