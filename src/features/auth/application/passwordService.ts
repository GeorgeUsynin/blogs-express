import bcrypt from 'bcrypt';
import { SETTINGS } from '../../../core/settings';

export const passwordService = {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(SETTINGS.SALT_ROUNDS);

        return bcrypt.hash(password, salt);
    },

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    },
};
