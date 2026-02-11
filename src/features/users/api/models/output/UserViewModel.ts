export type UserViewModel = {
    /**
     * Unique user identifier
     */
    id: string;

    /** Unique user login */
    login: string;

    /** Unique email address */
    email: string;

    /**
     * User creation date and time (ISO string)
     */
    createdAt: string;
};
