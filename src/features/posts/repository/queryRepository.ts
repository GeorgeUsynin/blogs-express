import { WithId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { PostModel, TPost } from '../domain';
import { PostQueryInput } from '../api/models';
import { PostReadModel, TNewestLikes } from './models';
import { LikesQueryRepository } from '../../likes/repository';
import { ParentType, TLike } from '../../likes/domain';
import { LikeStatus } from '../../../core/constants';
import { UsersQueryRepository } from '../../users/repository';

type FindPostsFilter = Partial<Pick<TPost, 'blogId'>>;
type TParentNewestLikes = Map<string, WithId<TLike>[]>;
type TParentNewestLikesWithLogin = Map<string, TNewestLikes[]>;

const NEWEST_LIKES_LIMIT = 3;

@injectable()
export class PostsQueryRepository {
    constructor(
        @inject(LikesQueryRepository)
        private likesQueryRepository: LikesQueryRepository,
        @inject(UsersQueryRepository)
        private usersQueryRepository: UsersQueryRepository
    ) {}

    async findMany(queryDto: PostQueryInput, userId?: string): Promise<{ items: PostReadModel[]; totalCount: number }> {
        return this.findManyWithFilter(queryDto, {}, userId);
    }

    async findManyByBlogId(
        blogId: string,
        queryDto: PostQueryInput,
        userId?: string
    ): Promise<{ items: PostReadModel[]; totalCount: number }> {
        return this.findManyWithFilter(queryDto, { blogId }, userId);
    }

    async findManyWithFilter(
        queryDto: PostQueryInput,
        filter: FindPostsFilter = {},
        userId?: string
    ): Promise<{ items: PostReadModel[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize } = queryDto;
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            PostModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .lean()
                .exec(),
            PostModel.countDocuments(filter).exec(),
        ]);

        if (items.length === 0) {
            return { items: [], totalCount };
        }

        const postIds = items.map(post => post._id.toString());

        const newestLikes = await this.getNewestLikesByPostIds(postIds, NEWEST_LIKES_LIMIT);
        const enrichedNewestLikes = await this.enrichNewestLikesWithAuthorLogin(newestLikes);

        if (!userId) {
            const mappedItems = items.map(post => ({
                ...post,
                myStatus: LikeStatus.None,
                newestLikes: enrichedNewestLikes.get(post._id.toString()) ?? [],
            }));

            return { items: mappedItems, totalCount };
        } else {
            const likes = await this.likesQueryRepository.findLikesByParentIds(userId, ParentType.Post, postIds);
            const statusByPostId = new Map(likes.map(like => [like.parentId.toString(), like.likeStatus]));

            const mappedItems = items.map(post => {
                const id = post._id.toString();
                return {
                    ...post,
                    myStatus: statusByPostId.get(id) ?? LikeStatus.None,
                    newestLikes: enrichedNewestLikes.get(post._id.toString()) ?? [],
                };
            });
            return { items: mappedItems, totalCount };
        }
    }

    async findById(id: string, userId?: string): Promise<PostReadModel | null> {
        const post = await PostModel.findById(id).lean().exec();

        if (!post) return null;

        const myStatus = userId
            ? await this.likesQueryRepository.findMyStatusByParentId(userId, ParentType.Post, id)
            : LikeStatus.None;

        const newestLikes = await this.getNewestLikesByPostIds([id], NEWEST_LIKES_LIMIT);
        const enrichedNewestLikes = await this.enrichNewestLikesWithAuthorLogin(newestLikes);

        return { ...post, myStatus, newestLikes: enrichedNewestLikes.get(id) ?? [] };
    }

    private async getNewestLikesByPostIds(postIds: string[], limit: number): Promise<TParentNewestLikes> {
        const newestLikes = await this.likesQueryRepository.getNewestLikesPerParentId(postIds, ParentType.Post, limit);

        return new Map(newestLikes.map(el => [el.parentId, el.newestLikes]));
    }

    private async enrichNewestLikesWithAuthorLogin(
        newestLikes: TParentNewestLikes
    ): Promise<TParentNewestLikesWithLogin> {
        const uniqueAuthorIds = new Set([...newestLikes.values()].flat().map(like => like.authorId));
        const authors = await this.usersQueryRepository.findUsersByUserIds([...uniqueAuthorIds]);
        const loginByAuthorId = new Map(authors.map(author => [author._id.toString(), author.login]));

        const result: TParentNewestLikesWithLogin = new Map();

        for (const [postId, likes] of newestLikes) {
            result.set(
                postId,
                likes.map(like => ({
                    authorId: like.authorId,
                    authorLogin: loginByAuthorId.get(like.authorId)!,
                    createdAt: like.createdAt,
                }))
            );
        }

        return result;
    }
}
