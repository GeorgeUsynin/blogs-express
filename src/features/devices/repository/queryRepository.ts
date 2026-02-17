import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { TDevice } from '../domain';
import { devicesCollection } from '../../../db';

type FindDevicesFilter = Partial<Pick<TDevice, 'userId'>>;

@injectable()
export class DevicesQueryRepository {
    async findManyByUserId(userId: string): Promise<WithId<TDevice>[]> {
        return this.findManyWithFilter({ userId });
    }

    async findManyWithFilter(filter: FindDevicesFilter = {}): Promise<WithId<TDevice>[]> {
        const items = await devicesCollection.find(filter).toArray();

        return items;
    }
}
