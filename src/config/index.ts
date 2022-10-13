import dotenv from 'dotenv';
import {Dialect} from 'sequelize';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
    env,
    isDev: env === 'development',
    isTest: env === 'testing',
    port: process.env.APP_PORT || 5000,
    auth: {
        accessToken: process.env.ACCESS_TOKEN as string,
        refreshToken: process.env.REFRESH_TOKEN as string,
    },
    database: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.NODE_ENV == 'testing' ? 'app' : process.env.DB_NAME || 'postgres',
        port: parseInt(process.env.DB_PORT as string) || 5432,
        host: process.env.DB_HOST,
        dialect: 'postgres' as Dialect,
    },
};

export default baseConfig;
