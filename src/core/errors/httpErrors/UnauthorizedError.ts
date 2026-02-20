export class UnauthorizedError extends Error {
    constructor(
        message?: string,
        public readonly code?: string
    ) {
        super(message);
    }
}
