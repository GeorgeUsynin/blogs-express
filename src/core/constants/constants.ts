export enum HTTP_STATUS_CODES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404,
    UNAUTHORIZED_401 = 401,
    INTERNAL_SERVER_ERROR_500 = 500,
    UNPROCESSABLE_ENTITY_422 = 422,
}

export const ROUTES = {
    BLOGS: '/blogs',
    POSTS: '/posts',
    TESTING: '/testing/all-data',
};
