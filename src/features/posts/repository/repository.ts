import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { PostDocument, PostModel, type TPost } from '../domain';
import { RepositoryNotFoundError } from '../../../core/errors';

@injectable()
export class PostsRepository {
    async findByIdOrFail(id: string): Promise<PostDocument> {
        const res = await PostModel.findById(id);

        if (!res) {
            throw new RepositoryNotFoundError("Post doesn't exist");
        }
        return res;
    }

    async save(post: PostDocument): Promise<WithId<TPost>> {
        return post.save();
    }
}
