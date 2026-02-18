import 'dotenv/config';
import { SignOptions } from 'jsonwebtoken';

export const SETTINGS = {
    PORT: process.env.PORT || 5001,
    JWT_SECRET: process.env.JWT_SECRET,
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
        COMMENTS: 'comments',
        USERS: 'users',
        DEVICES: 'devices',
        RATE_LIMIT: 'rateLimit',
    },
    MONGO_URL: process.env.MONGO_URL,
    SALT_ROUNDS: 10,
    EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS: 1,
    RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS: 1,
    JWT_ACCESS_TOKEN_EXPIRATION_IN_HOURS: '1h' as SignOptions['expiresIn'],
    JWT_REFRESH_TOKEN_EXPIRATION_IN_HOURS: '2h' as SignOptions['expiresIn'],
    API_RATE_LIMIT_TTL_IN_MS: 10000,
    API_RATE_LIMIT_MAXIMUM_ATTEMPTS: 5,
};
