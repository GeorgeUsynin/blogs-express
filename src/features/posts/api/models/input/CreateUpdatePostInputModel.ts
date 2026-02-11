export type CreateUpdatePostInputModel = {
    /**
     * Post title
     */
    title: string;

    /**
     * Short post description
     */
    shortDescription: string;

    /**
     * Post content
     */
    content: string;

    /**
     * Related blog identifier
     */
    blogId: string;
};
