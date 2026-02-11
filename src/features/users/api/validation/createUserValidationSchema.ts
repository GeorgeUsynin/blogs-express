import { makeStrictSchema } from '../../../../core/helpers';
import { CreateUserInputModel } from '../models';

const loginMinLength = 3;
const loginMaxLength = 10;
const passwordMinLength = 6;
const passwordMaxLength = 20;
const loginPattern = '^[a-zA-Z0-9_-]*$';
const emailPattern = '^[w-.]+@([w-]+.)+[w-]{2,4}$';

export const createUserValidationSchema = makeStrictSchema<CreateUserInputModel>({
    login: {
        exists: {
            errorMessage: 'Login field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Login field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Login field should not be empty or contain only spaces',
        },
        isLength: {
            options: { min: loginMinLength, max: loginMaxLength },
            errorMessage: `Login length should be from ${loginMinLength} to ${loginMaxLength} characters`,
        },
        matches: {
            options: /^[a-zA-Z0-9_-]*$/,
            errorMessage: `Login should match the specified ${loginPattern} pattern`,
        },
    },
    password: {
        exists: {
            errorMessage: 'Password field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Password field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Password field should not be empty or contain only spaces',
        },
        isLength: {
            options: { min: passwordMinLength, max: passwordMaxLength },
            errorMessage: `Password length should be from ${passwordMinLength} to ${passwordMaxLength} characters`,
        },
    },
    email: {
        exists: {
            errorMessage: 'Email field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Email field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Email field should not be empty or contain only spaces',
        },
        isEmail: {
            errorMessage: `Email should match the specified ${emailPattern} pattern`,
        },
    },
});
