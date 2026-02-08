import { type Request, type Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../share/constants';
import { db } from '../../../../db';

export const deleteAllData = (req: Request, res: Response) => {
    db.blogs = [];
    db.posts = [];

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
