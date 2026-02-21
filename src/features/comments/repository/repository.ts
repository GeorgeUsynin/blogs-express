import { injectable } from 'inversify';
import { CommentDocument, CommentModel } from '../domain';

@injectable()
export class CommentsRepository {
    async findById(id: string): Promise<CommentDocument | null> {
        return CommentModel.findById(id);
    }

    async save(comment: CommentDocument): Promise<string> {
        const newComment = await comment.save();

        return newComment._id.toString();
    }
}
