import { injectable } from 'inversify';
import { PostDocument, PostModel } from '../domain';

@injectable()
export class PostsRepository {
    async findById(id: string): Promise<PostDocument | null> {
        return PostModel.findById(id);
    }

    async save(post: PostDocument): Promise<void> {
        await post.save();
    }
}
