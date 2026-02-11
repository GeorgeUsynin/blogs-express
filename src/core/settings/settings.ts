import 'dotenv/config';

export const SETTINGS = {
    PORT: process.env.PORT || 5001,
    CREDENTIALS: {
        LOGIN: process.env.ADMIN_USERNAME,
        PASSWORD: process.env.ADMIN_PASSWORD,
    },
    DB_NAME: {
        PROD: 'BloggerPlatformReborn',
        TEST: 'TestBloggerPlatform',
    },
    COLLECTIONS: {
        BLOGS: 'blogs',
        POSTS: 'posts',
        USERS: 'users',
    },
    MONGO_URL: process.env.MONGO_URL,
    SALT_ROUNDS: 10,
};
