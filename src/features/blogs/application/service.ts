import { CreateUpdateBlogInputModel } from '../api/models';
import { blogsRepository } from '../repository';
import { TBlog } from '../domain';

export const blogsService = {
    async removeById(id: string): Promise<void> {
        await blogsRepository.removeById(id);

        return;
    },

    async create(blogAttributes: CreateUpdateBlogInputModel): Promise<string> {
        const newBlog: TBlog = {
            isMembership: false,
            createdAt: new Date().toISOString(),
            ...blogAttributes,
        };

        return blogsRepository.create(newBlog);
    },

    async updateById(id: string, blogAttributes: CreateUpdateBlogInputModel): Promise<void> {
        await blogsRepository.updateById(id, blogAttributes);

        return;
    },
};
