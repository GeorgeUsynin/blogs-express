import { inject, injectable } from 'inversify';
import { CommentModel, TComment } from '../domain';
import { CommentQueryInput } from '../api/models';
import { LikesQueryRepository } from '../../likes/repository';
import { ParentType } from '../../likes/domain';
import { CommentReadModel } from './models';
import { LikeStatus } from '../../../core/constants';

type FindCommentsFilter = Partial<Pick<TComment, 'postId'>>;

@injectable()
export class CommentsQueryRepository {
    constructor(
        @inject(LikesQueryRepository)
        private likesQueryRepository: LikesQueryRepository
    ) {}

    async findManyByPostId(
        postId: string,
        queryDto: CommentQueryInput,
        userId?: string
    ): Promise<{ items: CommentReadModel[]; totalCount: number }> {
        return this.findManyWithFilter(queryDto, { postId }, userId);
    }

    async findManyWithFilter(
        queryDto: CommentQueryInput,
        filter: FindCommentsFilter = {},
        userId?: string
    ): Promise<{ items: CommentReadModel[]; totalCount: number }> {
        const { sortBy, sortDirection, pageNumber, pageSize } = queryDto;
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            CommentModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .lean()
                .exec(),
            CommentModel.countDocuments(filter).exec(),
        ]);

        if (!userId) {
            const mappedItems = items.map(comment => ({ ...comment, myStatus: LikeStatus.None }));
            return { items: mappedItems, totalCount };
        }

        const commentIds = items.map(comment => comment._id.toString());
        const likes = await this.likesQueryRepository.findLikesByParentIds(userId, ParentType.Comment, commentIds);
        const statusByCommentId = new Map(likes.map(like => [like.parentId.toString(), like.likeStatus]));
        const mappedItems = items.map(comment => {
            const id = comment._id.toString();
            return {
                ...comment,
                myStatus: statusByCommentId.get(id) ?? LikeStatus.None,
            };
        });
        return { items: mappedItems, totalCount };
    }

    async findById(id: string, userId?: string): Promise<CommentReadModel | null> {
        const comment = await CommentModel.findById(id).lean();

        if (!comment) return null;

        const myStatus = userId
            ? await this.likesQueryRepository.findMyStatusByParentId(userId, ParentType.Comment, id)
            : LikeStatus.None;

        return { ...comment, myStatus };
    }
}
