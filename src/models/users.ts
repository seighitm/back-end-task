import {DataTypes, Sequelize} from 'sequelize';

import {User} from '../repositories/users';
import {UserType} from '../types/enums';

export function setupUsersModel(modelName: string, sequelize: Sequelize): void {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(UserType),
      defaultValue: UserType.BLOGGER,
      allowNull: false,
      validate: {
        isIn: [Object.values(UserType)],
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      field: 'password_hash',
      allowNull: false,
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
    tableName: 'users',
    modelName,
    name: {
      singular: 'user',
      plural: 'users',
    },
    timestamps: true,
  });
}
