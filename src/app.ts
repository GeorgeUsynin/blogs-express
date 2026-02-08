import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { VideosRouter, TestRouter } from './routers';
import { HTTP_STATUS_CODES } from './core/constants';
import { SETTINGS } from './core/settings';
import { setupSwagger } from './swagger/swagger-setup';

export const app = express();

// Parses incoming requests with JSON payloads
// and makes the data available in req.body
app.use(express.json());

// Enables Cross-Origin Resource Sharing (CORS)
// allowing requests from different origins (domains)
app.use(cors());

app.use(SETTINGS.PATH.BLOGS, VideosRouter);
app.use(SETTINGS.PATH.TESTING, TestRouter);

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0' });
});

setupSwagger(app);

export default app;
