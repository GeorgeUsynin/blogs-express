import { injectable, inject } from 'inversify';
import { LikesRepository } from '../repository';
import { SetLikeStatusDto } from './dto';
import { LikeStatus } from '../../../core/constants';
import { LikeModel, ParentType } from '../domain';

@injectable()
export class LikesService {
    constructor(
        @inject(LikesRepository)
        private likesRepository: LikesRepository
    ) {}

    async setLikeStatus(dto: SetLikeStatusDto): Promise<void> {
        const { authorId, parentId, likeStatus, parentType } = dto;

        const foundLike = await this.likesRepository.findByParentAndAuthor(parentId, parentType, authorId);

        if (!foundLike) {
            // not allowing like creation with None status
            if (likeStatus === LikeStatus.None) return;

            const newLike = LikeModel.createLike({
                authorId,
                parentId,
                likeStatus,
                parentType,
            });
            await this.likesRepository.save(newLike);
        } else {
            // if likeStatus is the same -> exit
            if (foundLike.isSameLikeStatus(likeStatus)) return;

            switch (likeStatus) {
                case LikeStatus.None:
                    await this.likesRepository.removeById(foundLike._id.toString());
                    break;
                case LikeStatus.Like:
                case LikeStatus.Dislike:
                    foundLike.updateLikeStatus(likeStatus);
                    await this.likesRepository.save(foundLike);
                    break;
            }
        }
    }

    async getLikesCounts(
        parentId: string,
        parentType: ParentType
    ): Promise<{
        likesCount: number;
        dislikesCount: number;
    }> {
        const [likesCount, dislikesCount] = await Promise.all([
            this.likesRepository.countByParentAndStatus(parentId, parentType, LikeStatus.Like),
            this.likesRepository.countByParentAndStatus(parentId, parentType, LikeStatus.Dislike),
        ]);

        return { likesCount, dislikesCount };
    }
}
