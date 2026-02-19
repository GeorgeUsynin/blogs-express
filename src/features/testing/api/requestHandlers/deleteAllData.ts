import mongoose from 'mongoose';
import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../../core/constants';

export const deleteAllData = async (_req: Request, res: Response) => {
    await mongoose.connection.db?.dropDatabase();

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
