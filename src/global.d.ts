export {};

declare global {
    namespace Express {
        export interface Request {
            userId?: string;
            deviceId?: string;
        }
    }

    namespace jwt {
        export interface JwtPayload {
            userId: string;
        }
    }
}
