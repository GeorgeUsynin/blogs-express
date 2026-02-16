import { param } from 'express-validator';

export const uuIdValidation = param('id')
    .exists()
    .withMessage('Id is required')
    .isString()
    .withMessage('Id must be a string')
    .isUUID()
    .withMessage('Incorrect format of UUID');
