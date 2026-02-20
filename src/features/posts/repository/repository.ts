import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { PostDocument, PostModel, type TPost } from '../domain';

@injectable()
export class PostsRepository {
    async findById(id: string): Promise<PostDocument | null> {
        return PostModel.findById(id);
    }

    async save(post: PostDocument): Promise<WithId<TPost>> {
        return post.save();
    }
}
