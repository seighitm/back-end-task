import express from 'express';

import { initSequelizeClient } from './sequelize';
import { initUsersRouter } from './routers';
import { initErrorRequestHandler, initNotFoundRequestHandler } from './middleware';
import config from './config';

const PORT = 8080;

async function main(): Promise<void> {
  const app = express();

  const sequelizeClient = await initSequelizeClient({...config.database});

  app.use(express.json());

  app.use('/api/v1/users', initUsersRouter(sequelizeClient));

  app.use('/', initNotFoundRequestHandler());

  app.use(initErrorRequestHandler());

  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.info(`app listening on port: '${PORT}'`);

      resolve();
    });
  });
}

main().then(() => console.info('app started')).catch(console.error);
