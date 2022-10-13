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
import validate from '../middleware/validate';
import {createPost} from '../validators';

export function initPostsRouter(sequelizeClient: SequelizeClient): Router {
    const router = Router({mergeParams: true});

    const tokenValidation = (optional = false) => initTokenValidationRequestHandler(sequelizeClient, optional);
    const adminValidation = initAdminValidationRequestHandler();

    router.route('/:id')
        .put(tokenValidation(), initUpdatePostRequestHandler(sequelizeClient))
        .get(tokenValidation(true), initGetPostRequestHandler(sequelizeClient))
        .patch(tokenValidation(), initSwitchHiddenStatusRequestHandler(sequelizeClient))
        .delete(tokenValidation(), initDeletePostRequestHandler(sequelizeClient));

    router.route('/')
        .post(tokenValidation(), validate(createPost), initCreatePostRequestHandler(sequelizeClient))
        .get(tokenValidation(true), initListPostsRequestHandler(sequelizeClient));

    return router;
}
