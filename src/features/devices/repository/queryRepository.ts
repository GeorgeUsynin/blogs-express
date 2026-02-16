import { WithId } from 'mongodb';
import { TDevice } from '../domain';
import { devicesCollection } from '../../../db';

type FindCommentsFilter = Partial<Pick<TDevice, 'userId'>>;

export const devicesQueryRepository = {
    async findManyByUserId(userId: string): Promise<WithId<TDevice>[]> {
        return this.findManyWithFilter({ userId });
    },

    async findManyWithFilter(filter: FindCommentsFilter = {}): Promise<WithId<TDevice>[]> {
        const items = await devicesCollection.find(filter).toArray();

        return items;
    },
};
