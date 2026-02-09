import { Collection, Db, MongoClient } from 'mongodb';
import { type TBlog, type TPost } from './types';
import { SETTINGS } from '../core';

export let client: MongoClient;
export let blogsCollection: Collection<TBlog>;
export let postsCollection: Collection<TPost>;
export let db: Db;

export async function runDB(url: string, isTest: boolean = true): Promise<void> {
    client = new MongoClient(url);
    const dbName = isTest ? SETTINGS.DB_NAME.TEST : SETTINGS.DB_NAME.PROD;
    db = client.db(dbName);

    blogsCollection = db.collection<TBlog>(SETTINGS.COLLECTIONS.BLOGS);
    postsCollection = db.collection<TPost>(SETTINGS.COLLECTIONS.POSTS);

    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}
