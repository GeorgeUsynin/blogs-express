import { WithId } from 'mongodb';
import { TBlog } from '../../../../db';
import { BlogViewModel } from '../../models';

export const mapToBlogViewModel = (blog: WithId<TBlog>): BlogViewModel => ({
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
    createdAt: blog.createdAt,
});
