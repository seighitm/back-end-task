import {User} from '../repositories/users';

export type CreateUserData = Pick<User, 'type' | 'name' | 'email'> & { password: User['passwordHash'] };
export type LoginUserData = Pick<User, 'email'> & { password: User['passwordHash'] };
