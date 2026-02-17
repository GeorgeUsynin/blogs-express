import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { SETTINGS } from '../../../core/settings';

@injectable()
export class PasswordService {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(SETTINGS.SALT_ROUNDS);

        return bcrypt.hash(password, salt);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
