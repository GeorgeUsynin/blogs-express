import { model, Schema } from 'mongoose';
import { TUser, TUserModel, UserDocument } from './types';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { SETTINGS } from '../../../core/settings';
import { CreateUserDto } from '../application/dto';
import { DomainError } from '../../../core/errors';

const loginPattern = '^[a-zA-Z0-9_-]*$';
const emailPattern = '^[w-.]+@([w-]+.)+[w-]{2,4}$';

const userSchema = new Schema<TUser>({
    login: {
        type: String,
        minlength: 3,
        maxLength: 10,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9_-]*$/.test(v);
            },
            message: props => `Login should match the specified ${loginPattern} pattern`,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `Email should match the specified ${emailPattern} pattern`,
        },
    },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    emailConfirmation: {
        isConfirmed: { type: Boolean, default: false },
        confirmationCode: { type: String, default: () => randomUUID() },
        expirationDate: {
            type: String,
            default: () =>
                add(new Date(), { hours: SETTINGS.EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS }).toISOString(),
        },
    },
    passwordRecovery: {
        recoveryCode: { type: String, default: null },
        expirationDate: { type: String, default: null },
    },
    isDeleted: { type: Boolean, default: false },
});

export const userStatics = {
    createUnconfirmedUser(dto: CreateUserDto) {
        const newUser = new UserModel(dto);

        return newUser;
    },

    createConfirmedUser(dto: CreateUserDto) {
        const newUser = new UserModel(dto);

        newUser.emailConfirmation.isConfirmed = true;

        return newUser;
    },
};

export const userMethods = {
    confirmUserEmail(code: string) {
        const that = this as UserDocument;

        if (that.emailConfirmation.isConfirmed) {
            throw new DomainError('Confirmation code already been applied', 'EMAIL_ALREADY_CONFIRMED', 'code');
        }

        if (that.emailConfirmation.confirmationCode !== code) {
            throw new DomainError('Invalid code', 'INVALID_CODE', 'code');
        }

        if (Date.now() > Date.parse(that.emailConfirmation.expirationDate)) {
            throw new DomainError('Confirmation code is expired', 'EXPIRED_CODE', 'code');
        }

        that.emailConfirmation.isConfirmed = true;
    },

    regenerateEmailConfirmationCode() {
        const that = this as UserDocument;

        if (that.emailConfirmation.isConfirmed) {
            throw new DomainError('Confirmation code already been applied', 'EMAIL_ALREADY_CONFIRMED', 'code');
        }

        const confirmationCode = that.createEmailConfirmationCode();

        return confirmationCode;
    },

    updatePasswordByRecoveryCode(code: string, passwordHash: string) {
        const that = this as UserDocument;

        if (that.passwordRecovery.recoveryCode !== code) {
            throw new DomainError('Invalid code', 'INVALID_CODE', 'recoveryCode');
        }

        if (Date.now() > Date.parse(that.passwordRecovery.expirationDate!)) {
            throw new DomainError('Password recovery code is expired', 'EXPIRED_CODE', 'recoveryCode');
        }

        that.passwordHash = passwordHash;
    },

    createEmailConfirmationCode() {
        const that = this as UserDocument;

        const newConfirmationCode = randomUUID();
        const newExpirationDate = add(new Date(), {
            hours: SETTINGS.EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
        }).toISOString();

        that.emailConfirmation.confirmationCode = newConfirmationCode;
        that.emailConfirmation.expirationDate = newExpirationDate;

        return newConfirmationCode;
    },

    createAndUpdatePasswordRecoveryCode() {
        const that = this as UserDocument;

        const recoveryCode = randomUUID();
        const expirationDate = add(new Date(), {
            hours: SETTINGS.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS,
        }).toISOString();

        that.passwordRecovery.recoveryCode = recoveryCode;
        that.passwordRecovery.expirationDate = expirationDate;

        return recoveryCode;
    },
};

userSchema.statics = userStatics;
userSchema.methods = userMethods;

// Soft delete implementation
userSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
userSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
userSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const UserModel = model<TUser, TUserModel>(SETTINGS.COLLECTIONS.USERS, userSchema);
