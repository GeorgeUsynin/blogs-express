import { type Request } from 'express';

// Request types
export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithParamsAndBody<P, T> = Request<P, {}, T>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
