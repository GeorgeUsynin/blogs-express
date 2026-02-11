import { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler = <
    P = any,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any,
    Locals extends Record<string, any> = Record<string, any>,
>(
    handler: (
        req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
        res: Response<ResBody, Locals>,
        next: NextFunction
    ) => Promise<unknown>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
    return (req, res, next) => {
        void Promise.resolve(handler(req, res, next)).catch(next);
    };
};
