import { WithId } from 'mongodb';
import { injectable } from 'inversify';
import { DeviceModel, TDevice } from '../domain';

type FindDevicesFilter = Partial<Pick<TDevice, 'userId'>>;

@injectable()
export class DevicesQueryRepository {
    async findManyByUserId(userId: string): Promise<WithId<TDevice>[]> {
        return this.findManyWithFilter({ userId });
    }

    async findManyWithFilter(filter: FindDevicesFilter = {}): Promise<WithId<TDevice>[]> {
        const items = await DeviceModel.find(filter).lean().exec();

        return items;
    }
}
