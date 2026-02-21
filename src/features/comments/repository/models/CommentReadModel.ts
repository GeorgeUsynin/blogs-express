import { WithId } from 'mongodb';
import { TComment } from '../../domain';
import { LikeStatus } from '../../../../core/constants';

export type CommentReadModel = WithId<TComment & { myStatus: LikeStatus }>;
