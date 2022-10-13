import Joi from 'joi';

export const createPost = {
    title: Joi.string().min(3).max(100).label('Title').required(),
    content: Joi.string().min(3).max(1000).label('Content').required(),
};
