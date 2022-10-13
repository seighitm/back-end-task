import express from 'express';

import {initSequelizeClient} from './sequelize';
import {initUsersRouter} from './routers';
import {initErrorRequestHandler, initNotFoundRequestHandler} from './middleware';
import config from './config';
import cors from 'cors';
import morgan from 'morgan';
import { initPostsRouter } from './routers/posts';
import cookieParser from 'cookie-parser';

async function main(): Promise<void> {
    const app = express();

    const sequelizeClient = await initSequelizeClient({...config.database});

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({extended: true}));
    app.use(morgan('dev'));

    app.use('/api/v1/users', initUsersRouter(sequelizeClient));
    app.use('/api/v1/posts', initPostsRouter(sequelizeClient));

    app.use('/', initNotFoundRequestHandler());

    app.use(initErrorRequestHandler());

    return new Promise((resolve) => {
        app.listen(config.port, () => {
            console.info(`app listening on port: '${config.port}'`);
            resolve();
        });
    });
}

main().then(() => console.info('app started')).catch(console.error);
