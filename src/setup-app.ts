import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { BlogsRouter, PostsRouter, TestRouter } from './features';
import { HTTP_STATUS_CODES, ROUTES } from './core/constants';
import { setupSwagger } from './core/swagger';

export const setupApp = (app: Express) => {
    // Parses incoming requests with JSON payloads
    // and makes the data available in req.body
    app.use(express.json());

    // Enables Cross-Origin Resource Sharing (CORS)
    // allowing requests from different origins (domains)
    app.use(cors());

    app.use(ROUTES.BLOGS, BlogsRouter);
    app.use(ROUTES.POSTS, PostsRouter);
    app.use(ROUTES.TESTING, TestRouter);

    app.get('/', (req: Request, res: Response) => {
        res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0' });
    });

    setupSwagger(app);

    return app;
};
