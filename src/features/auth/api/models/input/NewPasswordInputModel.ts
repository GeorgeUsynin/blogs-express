export type NewPasswordInputModel = {
    /**
     * New password chosen by the user.
     */
    newPassword: string;

    /**
     * Password recovery code sent to the user's email.
     */
    recoveryCode: string;
};
