import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../shared/constants';
import { db } from '../../../../db';

export const deleteAllData = async (req: Request, res: Response) => {
    const collections = await db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
