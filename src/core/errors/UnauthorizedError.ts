type TJwtError = {
    name: string;
    message: string;
    expiredAt?: Date;
    date?: Date;
};

export class UnauthorizedError extends Error {
    constructor(
        message?: string,
        public readonly jwtError?: TJwtError
    ) {
        super(message);
    }
}
