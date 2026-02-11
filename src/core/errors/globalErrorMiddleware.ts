import { NextFunction, Request, Response } from 'express';
import { errorsHandler } from './errorsHandler';

export const globalErrorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    errorsHandler(error, res);
};
