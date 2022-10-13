import {User} from '../repositories/users';

export interface TokenRequestData {
    id: number;
}

export interface TokenReesponseData {
    accessToken: string,
    refreshToken: string
}

export interface RequestAuth {
    token: string;
    user: User | {id: null, type: null};
}
