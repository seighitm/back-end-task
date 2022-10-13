import {BelongsTo, Model} from 'sequelize';

import type {SequelizeModels} from '../sequelize';
import {User} from './types';

export class Session extends Model {
    static associations: {
        author: BelongsTo<Session, User>;
    };

    id!: number;
    token!: string;
    userId!: number;
    createdAt!: Date;
    updatedAt!: Date;

    static associate(models: SequelizeModels): void {
        this.belongsTo(models.users, {foreignKey: 'userId', as: 'user'});
    }
}

export type SessionModel = typeof Session;
