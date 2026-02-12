import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../core/settings';
import { type TBlog } from '../features/blogs/domain';
import { type TPost } from '../features/posts/domain';
import { type TUser } from '../features/users/domain';
import { type TComment } from '../features/comments/domain';

export let client: MongoClient;
export let blogsCollection: Collection<TBlog>;
export let postsCollection: Collection<TPost>;
export let commentsCollection: Collection<TComment>;
export let usersCollection: Collection<TUser>;
export let db: Db;

const dbName = process.env.NODE_ENV === 'test' ? SETTINGS.DB_NAME.TEST : SETTINGS.DB_NAME.PROD;

export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    db = client.db(dbName);

    blogsCollection = db.collection<TBlog>(SETTINGS.COLLECTIONS.BLOGS);
    postsCollection = db.collection<TPost>(SETTINGS.COLLECTIONS.POSTS);
    commentsCollection = db.collection<TComment>(SETTINGS.COLLECTIONS.COMMENTS);
    usersCollection = db.collection<TUser>(SETTINGS.COLLECTIONS.USERS);

    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}
