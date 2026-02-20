import express from 'express';
import { setupApp } from '../setup-app';
import { agent } from 'supertest';
import { capitalizeFirstLetter } from '../core/helpers';
import { SETTINGS } from '../core/settings';
import { HTTP_STATUS_CODES, ROUTES } from '../core/constants';
import { runDB } from '../db';
import { TDataset } from './dataset';
import mongoose from 'mongoose';
import { BlogModel } from '../features/blogs/domain';
import { PostModel } from '../features/posts/domain';
import { CommentModel } from '../features/comments/domain';

const app = express();

export const request = agent(setupApp(app));

type CreateUpdateErrorViewModel = {
    errorsMessages: { status: HTTP_STATUS_CODES; message: string; field?: string; code?: string }[];
};

type TProperties = 'isRequired' | 'isString' | 'maxLength';

type TValues = {
    name?: TProperties[];
    description?: TProperties[];
    websiteUrl?: (TProperties | 'isPattern')[];
    title?: TProperties[];
    shortDescription?: TProperties[];
    content?: TProperties[];
    blogId?: (Exclude<TProperties, 'maxLength'> | 'blogIdNotExist')[];
};

const websiteUrlPattern = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';

const errorMessagesConfig = {
    isRequired: (field: string) => ({
        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
        message: `${capitalizeFirstLetter(field)} field is required`,
        field,
    }),
    isString: (field: string) => ({
        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
        message: `${capitalizeFirstLetter(field)} field should be a string`,
        field,
    }),
    maxLength: (field: string, length: number) => ({
        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
        message: `Max length should be ${length} characters`,
        field,
    }),
    isPattern: (field: string) => ({
        status: HTTP_STATUS_CODES.BAD_REQUEST_400,
        message: `${capitalizeFirstLetter(field)} should match the specified ${websiteUrlPattern} pattern`,
        field,
    }),
    blogIdNotExist: (field: string) => ({
        status: HTTP_STATUS_CODES.NOT_FOUND_404,
        message: `Blog doesn't exist`,
        code: 'BLOG_NOT_FOUND',
    }),
} as const;

export const createErrorMessages = (values: TValues) => {
    const { name, description, websiteUrl, title, shortDescription, content, blogId } = values;

    const errorsMessages: CreateUpdateErrorViewModel['errorsMessages'] = [];

    if (name) {
        name.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('name'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('name'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('name', 15));
                    break;
            }
        });
    }

    if (description) {
        description.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('description'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('description'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('description', 500));
                    break;
            }
        });
    }

    if (websiteUrl) {
        websiteUrl.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('websiteUrl'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('websiteUrl'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('websiteUrl', 100));
                    break;
                case 'isPattern':
                    errorsMessages.push(errorMessagesConfig.isPattern('websiteUrl'));
                    break;
            }
        });
    }

    if (title) {
        title.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('title'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('title'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('title', 30));
                    break;
            }
        });
    }

    if (shortDescription) {
        shortDescription.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('shortDescription'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('shortDescription'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('shortDescription', 100));
                    break;
            }
        });
    }

    if (content) {
        content.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('content'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('content'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('content', 1000));
                    break;
            }
        });
    }

    if (blogId) {
        blogId.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('blogId'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('blogId'));
                    break;
                case 'blogIdNotExist':
                    errorsMessages.push(errorMessagesConfig.blogIdNotExist('blogId'));
                    break;
            }
        });
    }

    return { errorsMessages };
};

export const getAuthorization = () => {
    const buff = Buffer.from(`${SETTINGS.CREDENTIALS.LOGIN}:${SETTINGS.CREDENTIALS.PASSWORD}`, 'utf8');
    const codedAuth = buff.toString('base64');

    return { Authorization: `Basic ${codedAuth}` };
};

export const loginAndGetToken = async (loginOrEmail: string, password: string): Promise<string> => {
    const { body } = await request
        .post(`${ROUTES.AUTH}/login`)
        .send({ loginOrEmail, password })
        .expect(HTTP_STATUS_CODES.OK_200);

    return body.accessToken;
};

export const dbHelper = {
    connectToDb: async () => {
        await runDB(SETTINGS.MONGO_URL!);
    },
    closeConnection: async () => {
        await mongoose.disconnect();
    },
    resetCollections: async (collectionNames: (keyof TDataset)[]) => {
        if (collectionNames.includes('blogs')) {
            await BlogModel.deleteMany({});
        }
        if (collectionNames.includes('posts')) {
            await PostModel.deleteMany({});
        }
        if (collectionNames.includes('comments')) {
            await CommentModel.deleteMany({});
        }
    },
    setDb: async (dataset: TDataset) => {
        if (dataset.blogs?.length) {
            await BlogModel.insertMany(dataset.blogs);
        }

        if (dataset.posts?.length) {
            await PostModel.insertMany(dataset.posts);
        }
        if (dataset.comments?.length) {
            await CommentModel.insertMany(dataset.comments);
        }
    },
    dropDb: async () => {
        await mongoose.connection.db?.dropDatabase();
    },
    getBlog: async (arrayIndex: number) => {
        const allBlogs = await BlogModel.find({}).lean();
        return allBlogs[arrayIndex];
    },
    getPost: async (arrayIndex: number) => {
        const allPosts = await PostModel.find({}).lean();
        return allPosts[arrayIndex];
    },
    getComment: async (arrayIndex: number) => {
        const allComments = await CommentModel.find({}).lean();
        return allComments[arrayIndex];
    },
};
