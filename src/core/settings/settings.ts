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
    },
    MONGO_URL: process.env.MONGO_URL,
    SALT_ROUNDS: 10,
    EXPIRATION_DATES: {
        REGISTRATION_CODE_HOURS: 1,
    },
    JWT_ACCESS_TOKEN_EXPIRATION_IN_HOURS: '1h' as SignOptions['expiresIn'],
    JWT_REFRESH_TOKEN_EXPIRATION_IN_HOURS: '2h' as SignOptions['expiresIn'],
};
