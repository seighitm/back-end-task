import {HasMany, Model} from 'sequelize';

import type {SequelizeModels} from '../sequelize';
import type {Post} from './types';
import {UserType} from '../types';
import {Session} from './sessions';

export class User extends Model {
    static associations: {
        posts: HasMany<User, Post>;
        sessions: HasMany<User, Session>;
    };

    id!: number;
    type!: UserType;
    name!: string;
    email!: string;
    passwordHash!: string;
    createdAt!: Date;
    updatedAt!: Date;

    static associate(models: SequelizeModels): void {
        this.hasMany(models.posts, {foreignKey: 'authorId', as: 'posts'});
        this.hasMany(models.sessions, {foreignKey: 'userId', as: 'sessions'});
    }
}

export type UsersModel = typeof User;
