import Joi from 'joi';
import {NextFunction, Request, RequestHandler, Response} from 'express';

export default function validate(schema: {
    email?: Joi.Schema,
    password?: Joi.Schema
    type?: Joi.Schema,
    name?: Joi.Schema,
    title?: Joi.Schema,
    content?: Joi.Schema
}): RequestHandler {
    return async (
        req: Request,
        _: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            await Joi.object()
                .options({abortEarly: false})
                .keys(schema)
                .validateAsync(req.body);
            next();
        } catch (err) {
            next(err);
        }
    };
}
