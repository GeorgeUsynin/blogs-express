export enum HTTP_STATUS_CODES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 = 401,
    FORBIDDEN_403 = 403,
    NOT_FOUND_404 = 404,
    UNPROCESSABLE_ENTITY_422 = 422,
    TOO_MANY_REQUESTS_429 = 429,
    INTERNAL_SERVER_ERROR_500 = 500,
}

export const ROUTES = {
    AUTH: '/auth',
    BLOGS: '/blogs',
    POSTS: '/posts',
    COMMENTS: '/comments',
    USERS: '/users',
    SECURITY_DEVICES: '/security/devices',
    TESTING: '/testing/all-data',
};
