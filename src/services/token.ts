import {Response} from 'express';
import {SequelizeClient} from '../sequelize';
import {Session} from '../repositories/sessions';
import {TokenReesponseData, TokenRequestData} from '../types/interfaces';
import jwt from 'jsonwebtoken';
import config from '../config';

export const setCookies = (res: Response, refreshToken: string): any => {
    res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
};

export async function saveToken(data: { userId: number, refreshToken: string }, sequelizeClient: SequelizeClient): Promise<Session> {
    const {models} = sequelizeClient;
    const {userId, refreshToken} = data;
    return await models.sessions.create({token: refreshToken, userId});
}

export async function deleteToken(data: { refreshToken: string }, sequelizeClient: SequelizeClient): Promise<number> {
    const {models} = sequelizeClient;
    const {refreshToken} = data;
    return await models.sessions.destroy({where: {token: refreshToken}});
}

export async function getToken(data: { refreshToken: string }, sequelizeClient: SequelizeClient): Promise<Session | null> {
    const {models} = sequelizeClient;
    const {refreshToken} = data;
    return await models.sessions.findOne({where: {token: refreshToken}});
}

export const generateTokens = (data: TokenRequestData): TokenReesponseData => {
    const accessToken = jwt.sign({...data}, config.auth.accessToken, {expiresIn: '30m'});
    const refreshToken = jwt.sign({...data}, config.auth.refreshToken, {expiresIn: '60d'});
    return {
        accessToken,
        refreshToken,
    };
};

export function isValidAccessToken(token: string): boolean {
    try {
        jwt.verify(token, config.auth.accessToken);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export function validateRefreshToken(refreshToken: string): { id: number } {
    return jwt.verify(refreshToken, config.auth.refreshToken) as { id: number };
}

export function extraDataFromAccessToken(token: string): TokenRequestData {
    const decoded = jwt.verify(token, config.auth.accessToken);
    return {id: (decoded as TokenRequestData).id};
}
