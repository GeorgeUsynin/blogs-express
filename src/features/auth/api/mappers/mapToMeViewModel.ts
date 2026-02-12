import { WithId } from 'mongodb';
import { TUser } from '../../../users/domain';
import { MeOutputModel } from '../models';

export const mapToMeViewModel = (user: WithId<TUser>): MeOutputModel => ({
    userId: user._id.toString(),
    login: user.login,
    email: user.email,
});
