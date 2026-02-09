import { Collection, Db, MongoClient } from 'mongodb';
import { type TBlog, type TPost } from './types';
import { SETTINGS } from '../core';

export let client: MongoClient;
export let blogsCollection: Collection<TBlog>;
export let postsCollection: Collection<TPost>;

export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

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
