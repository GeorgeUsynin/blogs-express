import mongoose from 'mongoose';
import { SETTINGS } from '../core/settings';

const dbName = process.env.NODE_ENV === 'test' ? SETTINGS.DB_NAME.TEST : SETTINGS.DB_NAME.PROD;

export async function runDB(url: string): Promise<void> {
    try {
        await mongoose.connect(url, { dbName });
        console.log('✅ Connected to the database');
    } catch (e) {
        await mongoose.disconnect();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}
