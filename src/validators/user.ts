import Joi from 'joi';
import {UserType} from '../types';

export const loginSchema = {
    email: Joi.string().max(100).label('Email').required(),
    password: Joi.string().min(3).max(100).label('Password').required(),
};

export const registerSchema = {
    ...loginSchema,
    name: Joi.string().max(100).label('Name').required(),
};

export const createUser = {
    ...registerSchema,
    type: Joi.string().valid(UserType.ADMIN, UserType.BLOGGER),
};
