import { ParamSchema } from 'express-validator';

export type StrictSchema<T extends object> = Record<keyof T, ParamSchema>;

export const makeStrictSchema = <T extends object>(schema: StrictSchema<T>) => schema;
