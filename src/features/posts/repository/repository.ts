import { db, type TPost } from '../../../db';
import { CreateUpdatePostInputModel } from '../models';
import { v4 as uuidv4 } from 'uuid';

export const postsRepository = {
    findAll(): TPost[] {
        return db.posts;
    },

    findById(id: string): TPost | undefined {
        return db.posts.find(post => post.id === id);
    },

    removeById(id: string) {
        for (let i = 0; i < db.posts.length; i++) {
            if (db.posts[i].id === id) {
                db.posts.splice(i, 1);
                break;
            }
        }
    },

    create(blogName: string, postPayload: CreateUpdatePostInputModel): TPost {
        const post: TPost = {
            id: uuidv4(),
            blogName,
            ...postPayload,
        };

        db.posts.push(post);

        return post;
    },

    update(id: string, postPayload: CreateUpdatePostInputModel) {
        for (let i = 0; i < db.posts.length; i++) {
            if (db.posts[i].id === id) {
                db.posts.splice(i, 1, { ...db.posts[i], ...postPayload });
                break;
            }
        }
    },
};
