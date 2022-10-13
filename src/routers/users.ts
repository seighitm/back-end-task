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
import {createUser, loginSchema, registerSchema} from '../validators';
import validate from '../middleware/validate';

export function initUsersRouter(sequelizeClient: SequelizeClient): Router {
    const router = Router({mergeParams: true});

    const tokenValidation = (optional = false) => initTokenValidationRequestHandler(sequelizeClient, optional);
    const adminValidation = initAdminValidationRequestHandler();

    router.route('/')
        .get(tokenValidation(true), initListUsersRequestHandler(sequelizeClient))
        .post(tokenValidation(), adminValidation, validate(createUser), initCreateUserRequestHandler(sequelizeClient));
    router.route('/login')
        .post(validate(loginSchema), initLoginUserRequestHandler(sequelizeClient));
    router.route('/register')
        .post(validate(registerSchema), initRegisterUserRequestHandler(sequelizeClient));
    router.route('/logout')
        .post(tokenValidation(), initLogoutUserRequestHandler(sequelizeClient));
    router.route('/refresh')
        .post(initRefreshSessionRequestHandler(sequelizeClient));

    return router;
}
