import { Router } from 'express';
import * as RequestHandlers from './requestHandlers';

export const TestRouter = Router();

const TestController = {
    deleteAllData: RequestHandlers.deleteAllData,
};

TestRouter.delete('/', TestController.deleteAllData);
