import { makeStrictSchema } from '../../../../core/helpers';
import { CreateLoginInputModel } from '../models';

export const createLoginValidationSchema = makeStrictSchema<CreateLoginInputModel>({
    loginOrEmail: {
        exists: {
            errorMessage: 'LoginOrEmail field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'LoginOrEmail field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'LoginOrEmail field should not be empty or contain only spaces',
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
    },
});
