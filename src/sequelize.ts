import {Options, Sequelize} from 'sequelize';

import type {PostsModel, UsersModel} from './repositories/types';

import {setupPostsModel, setupSessionsModel, setupUsersModel} from './models';
import {SessionModel} from './repositories/sessions';

const postsModelName = 'posts';
const usersModelName = 'users';
const sessionModelName = 'sessions';

export async function initSequelizeClient(params: SetupSequelizeParams): Promise<SequelizeClient> {
  const {dialect, host, port, username, password, database} = params;

  const sequelizeClient = new Sequelize({dialect, host, port, username, password, database, logging: false});

  setupUsersModel(usersModelName, sequelizeClient);
  setupPostsModel(postsModelName, sequelizeClient);
  setupSessionsModel(sessionModelName, sequelizeClient);

  associateModels(sequelizeClient.models as unknown as SequelizeModels);

  await sequelizeClient.sync();

  return sequelizeClient as unknown as SequelizeClient;
}

function associateModels(models: SequelizeModels): void {
  for (const model of Object.values((models))) {
    const associate = (model as ModelWithPossibleAssociations).associate?.bind(model);
    if (associate) {
      associate(models);
    }
  }
}

type SetupSequelizeParams = Pick<Options, 'dialect' | 'host' | 'port' | 'username' | 'password' | 'database'>;

export interface SequelizeModels {
  [usersModelName]: UsersModel;
  [postsModelName]: PostsModel;
  [sessionModelName]: SessionModel;
}

interface ModelWithPossibleAssociations {
  associate?(models: SequelizeModels): void;
}

// @ts-expect-error sequelize was not built for this kind of modifications
export interface SequelizeClient extends Sequelize {
  models: SequelizeModels;
}
