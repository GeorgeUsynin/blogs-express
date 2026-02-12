import { WithId } from 'mongodb';
import { TUser } from '../../domain';
import { UserViewModel } from '../models';

export const mapToUserViewModel = (user: WithId<TUser>): UserViewModel => ({
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
});
