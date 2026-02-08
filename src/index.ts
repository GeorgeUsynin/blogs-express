import 'dotenv/config';

import { app } from './app';
import { SETTINGS } from './core/settings';

app.listen(SETTINGS.PORT, () => {
    console.log(`Listening on port ${SETTINGS.PORT}`);
});
