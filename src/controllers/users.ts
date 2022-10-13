import {SequelizeClient} from '../sequelize';
import {RequestHandler} from 'express';
import {createUser, fetchUsers, loginUser, logout, refresh} from '../services/users';
import {CreateUserData, RequestAuth, UserType} from '../types';
import {setCookies} from '../services';
import {isNullOrUndefined} from '../utils/primitiveChecks';

export function initLoginUserRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const {email, password} = req.body as { name: string; email: string; password: string };
            const user = await loginUser({email, password}, sequelizeClient);
            setCookies(res, user.tokens.refreshToken);
            return res.json({accessToken: user.tokens.accessToken});
        } catch (error) {
            next(error);
        }
    };
}

export function initRegisterUserRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const {name, email, password} = req.body as Omit<CreateUserData, 'type'>;
            const user = await createUser({type: UserType.BLOGGER, name, email, password}, sequelizeClient);
            const existToken = !isNullOrUndefined(user.tokens);
            if (existToken) {
                setCookies(res, user.tokens!.refreshToken);
            }
            return res.json(existToken ? {accessToken: user.tokens!.accessToken} : user);
        } catch (error) {
            next(error);
        }
    };
}

export function initListUsersRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const {auth: {user: {type: userType}}} = req as unknown as { auth: RequestAuth };
            const users = await fetchUsers(userType, sequelizeClient);
            return res.json(users);
        } catch (error) {
            next(error);
        }
    };
}

export function initCreateUserRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const {type, name, email, password} = req.body as CreateUserData;
            const user = await createUser({type, name, email, password}, sequelizeClient);
            return res.json({accessToken: user.tokens!.accessToken});
        } catch (error) {
            next(error);
        }
    };
}

export function initLogoutUserRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const {refreshToken} = req.cookies as unknown as { refreshToken: string };
            const token = await logout({refreshToken}, sequelizeClient);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) {
            next(error);
        }
    };
}

export function initRefreshSessionRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const {refreshToken} = req.cookies as unknown as { refreshToken: string };
            const user = await refresh({refreshToken}, sequelizeClient);
            setCookies(res, user.tokens.refreshToken);
            return res.json(user.info);
        } catch (error) {
            next(error);
        }
    };
}
