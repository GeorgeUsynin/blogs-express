export type BlogViewModel = {
    /**
     * Unique blog identifier
     */
    id: string;

    /**
     * Blog name
     */
    name: string;

    /**
     * Blog description
     */
    description: string;

    /**
     * Blog website URL
     */
    websiteUrl: string;

    /**
     * Indicates whether the blog is membership-based
     */
    isMembership: boolean;

    /**
     * Blog creation date and time (ISO string)
     */
    createdAt: string;
};
