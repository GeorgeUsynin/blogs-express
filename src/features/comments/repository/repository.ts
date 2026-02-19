import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { CommentDocument, CommentModel, type TComment } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

@injectable()
export class CommentsRepository {
    async findByIdOrFail(id: string): Promise<CommentDocument> {
        const res = await CommentModel.findById(id);

        if (!res) {
            throw new RepositoryNotFoundError("Comment doesn't exist");
        }
        return res;
    }

    async save(comment: CommentDocument): Promise<WithId<TComment>> {
        return comment.save();
    }
}
