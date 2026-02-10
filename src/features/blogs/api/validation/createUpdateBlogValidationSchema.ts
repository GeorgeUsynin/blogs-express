import { CreateUpdateBlogInputModel } from '../models';
import { Schema } from 'express-validator';

const nameMaxLength = 15;
const descriptionMaxLength = 500;
const websiteUrlMaxLength = 100;
const pattern = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';

export const createUpdateBlogValidationSchema: Schema<keyof CreateUpdateBlogInputModel> = {
    name: {
        exists: {
            errorMessage: 'Name field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Name field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Name field should not be empty or contain only spaces',
        },
        isLength: {
            options: { max: nameMaxLength },
            errorMessage: `Max length should be ${nameMaxLength} characters`,
        },
    },
    description: {
        exists: {
            errorMessage: 'Description field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Description field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Description field should not be empty or contain only spaces',
        },
        isLength: {
            options: { max: descriptionMaxLength },
            errorMessage: `Max length should be ${descriptionMaxLength} characters`,
        },
    },
    websiteUrl: {
        exists: {
            errorMessage: 'WebsiteUrl field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'WebsiteUrl field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'WebsiteUrl field should not be empty or contain only spaces',
        },
        isLength: {
            options: { max: websiteUrlMaxLength },
            errorMessage: `Max length should be ${websiteUrlMaxLength} characters`,
        },
        isURL: {
            errorMessage: `WebsiteUrl should match the specified ${pattern} pattern`,
        },
    },
};
