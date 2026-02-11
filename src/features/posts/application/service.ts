import { WithId } from 'mongodb';
import { CreateUpdatePostInputModel, PostQueryInput } from '../api/models';
import { TPost } from '../domain';
import { postsRepository } from '../repository';
import { blogsRepository } from '../../blogs/repository';

export const postsService = {
    async findMany(queryDto: PostQueryInput): Promise<{ items: WithId<TPost>[]; totalCount: number }> {
        return postsRepository.findMany(queryDto);
    },

    async findManyByBlogId(
        blogId: string,
        queryDto: PostQueryInput
    ): Promise<{ items: WithId<TPost>[]; totalCount: number }> {
        await blogsRepository.findByIdOrFail(blogId);

        return postsRepository.findManyByBlogId(blogId, queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<TPost>> {
        return postsRepository.findByIdOrFail(id);
    },

    async removeById(id: string): Promise<void> {
        await postsRepository.removeById(id);

        return;
    },

    async create(postAttributes: CreateUpdatePostInputModel): Promise<string> {
        const { name: blogName } = await blogsRepository.findByIdOrFail(postAttributes.blogId);

        const newPost: TPost = {
            blogName,
            createdAt: new Date().toISOString(),
            ...postAttributes,
        };

        return postsRepository.create(newPost);
    },

    async updateById(id: string, postAttributes: CreateUpdatePostInputModel): Promise<void> {
        await blogsRepository.findByIdOrFail(postAttributes.blogId);

        await postsRepository.updateById(id, postAttributes);

        return;
    },
};
