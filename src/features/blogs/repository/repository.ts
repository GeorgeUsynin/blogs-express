import { db, type TBlog } from '../../../db';
import { CreateUpdateBlogInputModel } from '../models';
import { randomUUID } from 'crypto';

export const blogsRepository = {
    findAll(): TBlog[] {
        return db.blogs;
    },

    findById(id: string): TBlog | undefined {
        return db.blogs.find(blog => blog.id === id);
    },

    removeById(id: string) {
        for (let i = 0; i < db.blogs.length; i++) {
            if (db.blogs[i].id === id) {
                db.blogs.splice(i, 1);
                break;
            }
        }
    },

    create(blogPayload: CreateUpdateBlogInputModel): TBlog {
        const blog: TBlog = {
            id: randomUUID(),
            ...blogPayload,
        };

        db.blogs.push(blog);

        return blog;
    },

    update(id: string, blogPayload: CreateUpdateBlogInputModel) {
        for (let i = 0; i < db.blogs.length; i++) {
            if (db.blogs[i].id === id) {
                db.blogs.splice(i, 1, { ...db.blogs[i], ...blogPayload });
                break;
            }
        }
    },
};
