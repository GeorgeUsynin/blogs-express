import { SETTINGS } from '../settings';

export const ErrorCodes = {
    LOGIN_ALREADY_EXISTS: 'LOGIN_ALREADY_EXISTS',
    EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
    EMAIL_ALREADY_CONFIRMED_BY_CODE: 'EMAIL_ALREADY_CONFIRMED_BY_CODE',
    INVALID_CONFIRMATION_CODE: 'INVALID_CONFIRMATION_CODE',
    INVALID_PASSWORD_RECOVERY_CODE: 'INVALID_PASSWORD_RECOVERY_CODE',
    CONFIRMATION_CODE_EXPIRED: 'CONFIRMATION_CODE_EXPIRED',
    PASSWORD_RECOVERY_CODE_EXPIRED: 'PASSWORD_RECOVERY_CODE_EXPIRED',
    NOT_AN_OWNER_OF_THIS_DEVICE: 'NOT_AN_OWNER_OF_THIS_DEVICE',
    NOT_AN_OWNER_OF_THIS_COMMENT: 'NOT_AN_OWNER_OF_THIS_COMMENT',
    BLOG_NOT_FOUND: 'BLOG_NOT_FOUND',
    POST_NOT_FOUND: 'POST_NOT_FOUND',
    COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
    DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    LIKE_NOT_FOUND: 'LIKE_NOT_FOUND',
    API_RATE_LIMIT: 'API_RATE_LIMIT',
    BLOG_CREATION_FAILED: 'BLOG_CREATION_FAILED',
    POST_CREATION_FAILED: 'POST_CREATION_FAILED',
    COMMENT_CREATION_FAILED: 'COMMENT_CREATION_FAILED',
    USER_CREATION_FAILED: 'USER_CREATION_FAILED',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export const ErrorMessages: Record<ErrorCode, string> = {
    [ErrorCodes.LOGIN_ALREADY_EXISTS]: 'The login is not unique',
    [ErrorCodes.EMAIL_ALREADY_EXISTS]: 'The email address is not unique',
    [ErrorCodes.EMAIL_ALREADY_CONFIRMED_BY_CODE]: 'Confirmation code already been applied',
    [ErrorCodes.INVALID_CONFIRMATION_CODE]: 'Invalid confirmation code',
    [ErrorCodes.INVALID_PASSWORD_RECOVERY_CODE]: 'Invalid password recovery code',
    [ErrorCodes.CONFIRMATION_CODE_EXPIRED]: 'Confirmation code expired',
    [ErrorCodes.PASSWORD_RECOVERY_CODE_EXPIRED]: 'Password recovery code expired',
    [ErrorCodes.NOT_AN_OWNER_OF_THIS_DEVICE]: 'You can not modify this device',
    [ErrorCodes.NOT_AN_OWNER_OF_THIS_COMMENT]: 'You can not modify this comment',
    [ErrorCodes.BLOG_NOT_FOUND]: "Blog doesn't exist",
    [ErrorCodes.POST_NOT_FOUND]: "Post doesn't exist",
    [ErrorCodes.COMMENT_NOT_FOUND]: "Comment doesn't exist",
    [ErrorCodes.DEVICE_NOT_FOUND]: "Device doesn't exist",
    [ErrorCodes.USER_NOT_FOUND]: "User doesn't exist",
    [ErrorCodes.LIKE_NOT_FOUND]: "Like doesn't exist",
    [ErrorCodes.API_RATE_LIMIT]: `Too many requests! Please wait for ${SETTINGS.API_RATE_LIMIT_TTL_IN_MS / 1000} seconds`,
    [ErrorCodes.BLOG_CREATION_FAILED]: 'Blog creation failed',
    [ErrorCodes.POST_CREATION_FAILED]: 'Post creation failed',
    [ErrorCodes.COMMENT_CREATION_FAILED]: 'Comment creation failed',
    [ErrorCodes.USER_CREATION_FAILED]: 'User creation failed',
};

export const ErrorFields = {
    LOGIN: 'login',
    EMAIL: 'email',
    CODE: 'code',
    RECOVERY_CODE: 'recoveryCode',
} as const;

export type ErrorField = (typeof ErrorFields)[keyof typeof ErrorFields];
