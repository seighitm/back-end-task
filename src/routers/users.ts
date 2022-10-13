import {Router} from 'express';
import type {SequelizeClient} from '../sequelize';
import {initAdminValidationRequestHandler, initTokenValidationRequestHandler} from '../middleware';
import {
    initCreateUserRequestHandler,
    initListUsersRequestHandler,
    initLoginUserRequestHandler,
    initLogoutUserRequestHandler,
    initRefreshSessionRequestHandler,
    initRegisterUserRequestHandler,
} from '../controllers';

export function initUsersRouter(sequelizeClient: SequelizeClient): Router {
    const router = Router({mergeParams: true});

    const tokenValidation = initTokenValidationRequestHandler(sequelizeClient);
    const adminValidation = initAdminValidationRequestHandler();

    router.route('/')
        .get(
            tokenValidation, adminValidation,
            initListUsersRequestHandler(sequelizeClient))
        .post(tokenValidation, adminValidation, initCreateUserRequestHandler(sequelizeClient));

    router.route('/login')
        .post(initLoginUserRequestHandler(sequelizeClient));
    router.route('/register')
        .post(initRegisterUserRequestHandler(sequelizeClient));
    router.route('/logout')
        .post(tokenValidation, initLogoutUserRequestHandler(sequelizeClient));
    router.route('/refresh')
        .post(initRefreshSessionRequestHandler(sequelizeClient));

    return router;
}
