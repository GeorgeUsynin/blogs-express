import { HydratedDocument, Model } from 'mongoose';
import { userMethods, userStatics } from './userEntity';

export type TUser = {
    login: string;
    email: string;
    passwordHash: string;
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: string;
        isConfirmed: boolean;
    };
    passwordRecovery: {
        recoveryCode: string | null;
        expirationDate: string | null;
    };
    createdAt: string;
    isDeleted: boolean;
};

type UserStatics = typeof userStatics;
type UserMethods = typeof userMethods;

export type TUserModel = Model<TUser, {}, UserMethods> & UserStatics;

export type UserDocument = HydratedDocument<TUser, UserMethods>;
