import Joi from 'joi';
import {UserType} from '../types';

export const loginSchema = {
    email: Joi.string().max(100).label('Email').required(),
    password: Joi.string().min(6).max(100).label('Password').required(),
};

export const registerSchema = {
    name: Joi.string().max(100).label('Name').required(),
    email: Joi.string().max(100).label('Email').required(),
    password: Joi.string().min(6).max(100).label('Password').required(),
};

export const createUser = {
    ...registerSchema,
    type: Joi.string().valid(UserType.ADMIN, UserType.BLOGGER),
};
