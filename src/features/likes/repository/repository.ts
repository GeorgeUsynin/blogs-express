import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { LikeDocument, LikeModel, ParentType, TLike } from '../domain';
import { LikeStatus } from '../../../core/constants';

@injectable()
export class LikesRepository {
    async findById(id: string): Promise<LikeDocument | null> {
        return LikeModel.findById(id);
    }

    async findByParentAndAuthor(
        parentId: string,
        parentType: ParentType,
        authorId: string
    ): Promise<LikeDocument | null> {
        return LikeModel.findOne({ parentId, authorId, parentType });
    }

    async countByParentAndStatus(parentId: string, parentType: ParentType, likeStatus: LikeStatus): Promise<number> {
        return LikeModel.countDocuments({ parentId, parentType, likeStatus });
    }

    async removeById(id: string): Promise<void> {
        await LikeModel.findByIdAndDelete(id);
    }

    async save(like: LikeDocument): Promise<string> {
        const newLike = await like.save();

        return newLike._id.toString();
    }
}
