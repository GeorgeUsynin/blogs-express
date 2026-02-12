export {};

declare global {
    namespace Express {
        export interface Request {
            userId: string | null;
        }
    }

    namespace jwt {
        export interface JwtPayload {
            userId: string;
        }
    }
}
