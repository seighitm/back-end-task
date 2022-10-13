import {RequestHandler} from 'express';

import type {SequelizeClient} from '../sequelize';

import {ForbiddenError, UnauthorizedError} from '../errors';
import {isNullOrUndefined} from '../utils/primitiveChecks';
import {UserType, RequestAuth} from '../types';
import {extraDataFromAccessToken, isValidAccessToken} from '../services/token';

export function initTokenValidationRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
  return async function tokenValidationRequestHandler(req, res, next): Promise<void> {
    const {models} = sequelizeClient;
    try {
      const authorizationHeaderValue = req.header('authorization');
      if (isNullOrUndefined(authorizationHeaderValue)) {
        throw new UnauthorizedError('AUTH_MISSING');
      }

      const [type, token] = authorizationHeaderValue.split(' ');
      if (type?.toLowerCase() !== 'bearer') {
        throw new UnauthorizedError('AUTH_WRONG_TYPE');
      } else if (isNullOrUndefined(token)) {
        throw new UnauthorizedError('AUTH_TOKEN_MISSING');
      }

      if (!isValidAccessToken(token)) {
        throw new UnauthorizedError('AUTH_TOKEN_INVALID');
      }

      const {id} = extraDataFromAccessToken(token);

      const user = await models.users.findByPk(id);

      if (isNullOrUndefined(user)) {
        throw new UnauthorizedError('AUTH_TOKEN_INVALID');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (req as any).auth = {
        token,
        user: user,
      } as RequestAuth;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function initAdminValidationRequestHandler(): RequestHandler {
  return function adminValidationRequestHandler(req, res, next): void {
    const {auth: {user: {type}}} = req as unknown as { auth: RequestAuth };
    return type === UserType.ADMIN
        ? next()
        : next(new ForbiddenError('PROTECTED_ROUTE'));
  };
}
