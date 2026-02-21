import { injectable } from 'inversify';
import { LikeModel, NonNoneLikeStatus, ParentType, TLike } from '../domain';
import { LikeStatus } from '../../../core/constants';
import { WithId } from 'mongodb';

@injectable()
export class LikesQueryRepository {
    async findLikesByParentIds(
        authorId: string,
        parentType: ParentType,
        parentIds: string[]
    ): Promise<WithId<TLike>[]> {
        return LikeModel.find({ authorId, parentType, parentId: { $in: parentIds } }).lean();
    }

    async findMyStatusByParentId(
        authorId: string,
        parentType: ParentType,
        parentId: string
    ): Promise<LikeStatus.None | NonNoneLikeStatus> {
        const foundLike = await LikeModel.findOne({ authorId, parentType, parentId }).lean();

        return foundLike !== null ? foundLike.likeStatus : LikeStatus.None;
    }
}
