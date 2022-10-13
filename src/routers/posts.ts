import {Router} from 'express';
import type {SequelizeClient} from '../sequelize';
import {initAdminValidationRequestHandler, initTokenValidationRequestHandler} from '../middleware';
import {
    initCreatePostRequestHandler,
    initDeletePostRequestHandler,
    initGetPostRequestHandler,
    initListPostsRequestHandler,
    initSwitchHiddenStatusRequestHandler,
    initUpdatePostRequestHandler,
} from '../controllers';

export function initPostsRouter(sequelizeClient: SequelizeClient): Router {
    const router = Router({mergeParams: true});

    const tokenValidation = initTokenValidationRequestHandler(sequelizeClient);
    const adminValidation = initAdminValidationRequestHandler();

    router.route('/:id')
        .put(tokenValidation, initUpdatePostRequestHandler(sequelizeClient))
        .get(tokenValidation, initGetPostRequestHandler(sequelizeClient))
        .patch(tokenValidation, initSwitchHiddenStatusRequestHandler(sequelizeClient))
        .delete(tokenValidation, initDeletePostRequestHandler(sequelizeClient));

    router.route('/')
        .post(tokenValidation, initCreatePostRequestHandler(sequelizeClient))
        .get(tokenValidation, initListPostsRequestHandler(sequelizeClient));

    return router;
}

