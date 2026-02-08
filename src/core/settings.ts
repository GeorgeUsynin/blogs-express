import 'dotenv/config';

export const SETTINGS = {
    PORT: process.env.PORT || 5001,
    CREDENTIALS: {
        LOGIN: process.env.ADMIN_USERNAME,
        PASSWORD: process.env.ADMIN_PASSWORD,
    },
};
