import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../core/settings';
import { type TBlog } from '../features/blogs/domain';
import { type TPost } from '../features/posts/domain';

export let client: MongoClient;
export let blogsCollection: Collection<TBlog>;
export let postsCollection: Collection<TPost>;
export let db: Db;

const dbName = process.env.NODE_ENV === 'test' ? SETTINGS.DB_NAME.TEST : SETTINGS.DB_NAME.PROD;

export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
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
