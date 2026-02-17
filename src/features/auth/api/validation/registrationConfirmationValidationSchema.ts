import { makeStrictSchema } from '../../../../core/helpers';
import { RegistrationConfirmationInputModel } from '../models';

export const registrationConfirmationValidationSchema = makeStrictSchema<RegistrationConfirmationInputModel>({
    code: {
        exists: {
            errorMessage: 'Code field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Code field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Code field should not be empty or contain only spaces',
        },
        isUUID: {
            errorMessage: 'Code should be in UUID format',
        },
    },
});
