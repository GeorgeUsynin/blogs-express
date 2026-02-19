import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { RepositoryNotFoundError } from '../../../core/errors';
import { CommentModel, TComment } from '../domain';
import { CommentQueryInput } from '../api/models';

type FindCommentsFilter = Partial<Pick<TComment, 'postId'>>;

@injectable()
export class CommentsQueryRepository {
    async findMany(queryDto: CommentQueryInput): Promise<{ items: WithId<TComment>[]; totalCount: number }> {
        return this.findManyWithFilter(queryDto);
    }

    async findManyByPostId(
        postId: string,
        queryDto: CommentQueryInput
    ): Promise<{ items: WithId<TComment>[]; totalCount: number }> {
        return this.findManyWithFilter(queryDto, { postId });
    }

    async findManyWithFilter(
        queryDto: CommentQueryInput,
        filter: FindCommentsFilter = {}
    ): Promise<{ items: WithId<TComment>[]; totalCount: number }> {
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

        return { items, totalCount };
    }

    async findByIdOrFail(id: string): Promise<WithId<TComment>> {
        const res = await CommentModel.findById(id);

        if (!res) {
            throw new RepositoryNotFoundError("Comment doesn't exist");
        }
        return res;
    }
}
