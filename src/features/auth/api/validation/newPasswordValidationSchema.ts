import { makeStrictSchema } from '../../../../core/helpers';
import { NewPasswordInputModel } from '../models';

export const newPasswordValidationSchema = makeStrictSchema<NewPasswordInputModel>({
    newPassword: {
        exists: {
            errorMessage: 'NewPassword field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'NewPassword field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'NewPassword field should not be empty or contain only spaces',
        },
    },
    recoveryCode: {
        exists: {
            errorMessage: 'RecoveryCode field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'RecoveryCode field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'RecoveryCode field should not be empty or contain only spaces',
        },
        isUUID: {
            errorMessage: 'RecoveryCode should be in UUID format',
        },
    },
});
