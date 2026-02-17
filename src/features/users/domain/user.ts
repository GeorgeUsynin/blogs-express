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
};
