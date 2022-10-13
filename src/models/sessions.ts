import {DataTypes, Sequelize} from 'sequelize';

import {Session} from '../repositories/sessions';

export function setupSessionsModel(modelName: string, sequelize: Sequelize): void {
    Session.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'session',
        modelName,
        name: {
            singular: 'session',
            plural: 'sessions',
        },
        timestamps: true,
    });
}
