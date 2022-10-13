import {SequelizeClient} from '../sequelize';
import {User} from '../repositories/users';
import {Post} from '../repositories/posts';
import {isNullOrUndefined} from '../utils/primitiveChecks';
import {BadRequestError, ForbiddenError} from '../errors';
import {UserType} from '../types';
import {Op} from 'sequelize';

export async function createPost(data: { title: string, content: string, authorId: number | null }, sequelizeClient: SequelizeClient): Promise<Post> {
    const {models} = sequelizeClient;

    const {title, content, authorId} = data;

    const post = await models.posts.findOne({
        attributes: ['id'],
        where: {title},
        raw: true,
    }) as Pick<Post, 'id'> | null;

    if (!isNullOrUndefined(post)) {
        throw new BadRequestError('TITLE_ALREADY_EXISTS');
    }

    return await models.posts.create({title, authorId, content});
}

export async function updatePost(data: {
    userType: UserType | null,
    authorId: number | null,
    postId: string,
    title: string,
    content: string,
}, sequelizeClient: SequelizeClient): Promise<Post> {
    const {models} = sequelizeClient;

    const {title, content, authorId, postId, userType} = data;

    const post: Post | null = await models.posts.findByPk(postId);

    if (isNullOrUndefined(post)) {
        throw new BadRequestError('POST_NOT_EXISTS');
    } else if (post.authorId != authorId || userType != UserType.ADMIN) {
        throw new ForbiddenError('NOT_OWNER_OF_POST');
    }

    post.content = content;
    post.title = title;

    return await post.save();
}

export async function switchHiddenStatus(data: {
    userType: UserType | null,
    postId: string,
    authorId: number | null
}, sequelizeClient: SequelizeClient): Promise<Post> {
    const {models} = sequelizeClient;

    const {authorId, postId, userType} = data;

    const post: Post | null = await models.posts.findByPk(postId);

    if (isNullOrUndefined(post)) {
        throw new BadRequestError('POST_NOT_EXISTS');
    } else if (post.authorId != authorId || userType != UserType.ADMIN) {
        throw new ForbiddenError('NOT_OWNER_OF_POST');
    }

    post.isHidden = !post.isHidden;

    return await post.save();
}

export async function fetchManyPosts(data: {
    userType: UserType | null,
    authorId: number | null
}, sequelizeClient: SequelizeClient): Promise<Post[]> {
    const {authorId, userType} = data;
    const {models} = sequelizeClient;

    const isAdmin = userType === UserType.ADMIN;

    return await models.posts.findAll({
        include: [{model: User, as: 'author'}],
        ...(!isAdmin || isNullOrUndefined(userType)) && {
            where: {
                [Op.or]: [
                    {...!(isNullOrUndefined(authorId)) && {authorId: Number(authorId)}},
                    {isHidden: false},
                ],
            },
        },
    });
}

export async function deletePost(data: {
    userType: UserType | null,
    postId: string,
    authorId: number | null
}, sequelizeClient: SequelizeClient): Promise<Post> {
    const {models} = sequelizeClient;

    const {authorId, postId, userType} = data;

    const post: Post | null = await models.posts.findByPk(postId);

    if (isNullOrUndefined(post)) {
        throw new BadRequestError('POST_NOT_EXISTS');
    } else if (post.authorId != authorId || userType != UserType.ADMIN) {
        throw new ForbiddenError('RESTRICTED_TO_DELETE_POST');
    }

    await post.destroy();

    return post;
}

export async function fetchOnePost(data: {
    userType: UserType | null,
    authorId: number | null
}, sequelizeClient: SequelizeClient): Promise<Post | null> {
    const {authorId, userType} = data;
    const {models} = sequelizeClient;

    const isAdmin = userType === UserType.ADMIN;

    return await models.posts.findOne({
        include: [{model: User, as: 'author'}],
        ...(!isAdmin || isNullOrUndefined(userType)) && {
            where: {
                [Op.or]: [
                    {...!(isNullOrUndefined(authorId)) && {authorId: Number(authorId)}},
                    {isHidden: false},
                ],
            },
        },
    });
}
