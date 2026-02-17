export type UpdatePasswordAttributesDto = {
    userId: string;
    newPasswordHash: string;
    recoveryCode: null;
    expirationDate: null;
};
