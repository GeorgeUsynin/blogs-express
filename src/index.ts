import 'dotenv/config';
import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './core';
import { runDB } from './db/db';

const PORT = SETTINGS.PORT;
const MONGO_URL = SETTINGS.MONGO_URL!;

const bootstrap = async () => {
    const app = express();

    setupApp(app);

    await runDB(MONGO_URL);

    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
    });

    return app;
};

bootstrap().catch(e => {
    console.log('Error', e);
    process.exit(1);
});
