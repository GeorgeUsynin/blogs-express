import { ObjectId } from 'mongodb';
import { Schema } from 'express-validator';
import { CreateUpdatePostInputModel } from '../models';
import { blogsRepository } from '../../../blogs/repository';

const titleMaxLength = 30;
const shortDescriptionMaxLength = 100;
const contentMaxLength = 1000;

export const createUpdatePostValidationSchema: Schema<keyof CreateUpdatePostInputModel> = {
    title: {
        exists: {
            errorMessage: 'Title field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Title field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Title field should not be empty or contain only spaces',
        },
        isLength: {
            options: { max: titleMaxLength },
            errorMessage: `Max length should be ${titleMaxLength} characters`,
        },
    },
    shortDescription: {
        exists: {
            errorMessage: 'ShortDescription field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'ShortDescription field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'ShortDescription field should not be empty or contain only spaces',
        },
        isLength: {
            options: { max: shortDescriptionMaxLength },
            errorMessage: `Max length should be ${shortDescriptionMaxLength} characters`,
        },
    },
    content: {
        exists: {
            errorMessage: 'Content field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Content field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Content field should not be empty or contain only spaces',
        },
        isLength: {
            options: { max: contentMaxLength },
            errorMessage: `Max length should be ${contentMaxLength} characters`,
        },
    },
    blogId: {
        exists: {
            errorMessage: 'BlogId field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'BlogId field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'BlogId field should not be empty or contain only spaces',
        },
        custom: {
            options: async (blogId: string) => {
                const blog = await blogsRepository.findByIdOrFail(blogId);
                if (!blog) {
                    throw new Error('There is no blog existed with provided blogId');
                }
                return true;
            },
            errorMessage: 'There is no blog existed with provided blogId',
        },
    },
};
