import {SequelizeClient} from '../sequelize';
import {createPost, deletePost, fetchManyPosts, fetchOnePost, switchHiddenStatus, updatePost} from '../services/posts';
import {RequestHandler} from 'express';
import {Post} from '../repositories/posts';
import {RequestAuth} from '../types';

export function initCreatePostRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const {title, content} = req.body as { title: string; content: string };
            const {auth: {user: {id}}} = req as unknown as { auth: RequestAuth };
            const post: Post = await createPost({title, content, authorId: id}, sequelizeClient);
            return res.json(post);
        } catch (error) {
            next(error);
        }
    };
}

export function initUpdatePostRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const postId = req.params.id;
            const {title, content} = req.body as { title: string; content: string };
            const {auth: {user: {id, type}}} = req as unknown as { auth: RequestAuth };
            const post: Post = await updatePost({
                postId,
                title,
                content,
                authorId: id,
                userType: type,
            }, sequelizeClient);
            return res.json(post);
        } catch (error) {
            next(error);
        }
    };
}

export function initSwitchHiddenStatusRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const postId = req.params.id;
            const {auth: {user: {id, type}}} = req as unknown as { auth: RequestAuth };
            const post: Post = await switchHiddenStatus({postId, authorId: id, userType: type}, sequelizeClient);
            return res.json(post);
        } catch (error) {
            next(error);
        }
    };
}

export function initListPostsRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const {auth: {user: {id, type}}} = req as unknown as { auth: RequestAuth };
            const posts: Post[] = await fetchManyPosts({userType: type, authorId: id}, sequelizeClient);
            return res.json(posts);
        } catch (error) {
            next(error);
        }
    };
}

export function initDeletePostRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const postId = req.params.id;
            const {auth: {user: {id, type}}} = req as unknown as { auth: RequestAuth };
            const post: Post = await deletePost({postId, authorId: id, userType: type}, sequelizeClient);
            return res.json(post);
        } catch (error) {
            next(error);
        }
    };
}

export function initGetPostRequestHandler(sequelizeClient: SequelizeClient): RequestHandler {
    return async (req, res, next): Promise<any> => {
        try {
            const {auth: {user: {id, type}}} = req as unknown as { auth: RequestAuth };
            const post = await fetchOnePost({userType: type, authorId: id}, sequelizeClient);
            return res.json(post);
        } catch (error) {
            next(error);
        }
    };
}
