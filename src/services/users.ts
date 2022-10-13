import {SequelizeClient} from '../sequelize';
import {Op} from 'sequelize';
import {User} from '../repositories/users';
import {BadRequestError, UnauthorizedError} from '../errors';
import {comparePassword, hashPassword} from '../utils/security';
import {isNullOrUndefined} from '../utils/primitiveChecks';
import {CreateUserData, LoginUserData} from '../types/types';
import {UserType} from '../types/enums';
import {deleteToken, generateTokens, getToken, saveToken, validateRefreshToken} from './token';
import {TokenReesponseData} from '../types/interfaces';

export async function createUser(data: CreateUserData, sequelizeClient: SequelizeClient): Promise<{ info: User, tokens?: TokenReesponseData }> {
    const {models} = sequelizeClient;

    const {type, name, email, password} = data;

    const similarUser = await models.users.findOne({
        attributes: ['id', 'name', 'email'],
        where: {
            [Op.or]: [
                {name},
                {email},
            ],
        },
        raw: true,
    }) as Pick<User, 'id' | 'name' | 'email'> | null;

    if (!isNullOrUndefined(similarUser)) {
        if (similarUser.name === name) {
            throw new BadRequestError('NAME_ALREADY_USED');
        } else if (similarUser.email === email) {
            throw new BadRequestError('EMAIL_ALREADY_USED');
        }
    }

    const hashedPassword = await hashPassword(password);

    const user: User = await models.users.create({type, name, email, passwordHash: hashedPassword});

    const tokens = generateTokens({id: user.id});

    const idAdmin = type === UserType.ADMIN;

    if (!idAdmin) {
        await saveToken({userId: user.id, refreshToken: tokens.refreshToken}, sequelizeClient);
    }

    return idAdmin ? {info: user} : {info: user, tokens};
}

export async function loginUser(data: LoginUserData, sequelizeClient: SequelizeClient): Promise<{ info: Pick<User, 'id' | 'passwordHash'> | null, tokens: TokenReesponseData }> {
    const {models} = sequelizeClient;

    const {email, password} = data;

    const user = await models.users.findOne({
        attributes: ['id', 'passwordHash'],
        where: {email},
        raw: true,
    }) as Pick<User, 'id' | 'passwordHash'> | null;

    if (isNullOrUndefined(user)) {
        throw new UnauthorizedError('EMAIL_OR_PASSWORD_INCORRECT');
    }

    if (await comparePassword(user.passwordHash, password)) {
        throw new UnauthorizedError('EMAIL_OR_PASSWORD_INCORRECT');
    }

    const tokens = generateTokens({id: user.id});

    await saveToken({userId: user.id, refreshToken: tokens.refreshToken}, sequelizeClient);

    return {info: user, tokens};
}

export async function fetchUsers(userType: UserType, sequelizeClient: SequelizeClient): Promise<User[]> {
    const {models} = sequelizeClient;

    const isAdmin = userType === UserType.ADMIN;

    return await models.users.findAll({
        attributes: isAdmin ? ['id', 'name', 'email'] : ['name', 'email'],
        ...!isAdmin && {where: {type: {[Op.ne]: UserType.ADMIN}}},
        raw: true,
    });
}

export async function logout(userType: { refreshToken: string }, sequelizeClient: SequelizeClient): Promise<number> {
    const {refreshToken} = userType;
    return await deleteToken({refreshToken}, sequelizeClient);
}

export async function refresh(userType: { refreshToken: string }, sequelizeClient: SequelizeClient): Promise<{ info: User, tokens: TokenReesponseData }> {
    const {refreshToken} = userType;
    const {models} = sequelizeClient;

    const userData = validateRefreshToken(refreshToken);
    const tokenFromDb = await getToken({refreshToken}, sequelizeClient);

    if (isNullOrUndefined(userData) || isNullOrUndefined(tokenFromDb)) {
        throw new UnauthorizedError('ACCESS_DENIED');
    }

    const user = await models.users.findByPk(userData.id);

    if (isNullOrUndefined(user)) {
        throw new BadRequestError('USER_NOT_FOUND');
    }

    const tokens = generateTokens({id: user.id});
    await saveToken({userId: user.id, refreshToken: tokens.refreshToken}, sequelizeClient);

    return {
        info: user,
        tokens,
    };
}

