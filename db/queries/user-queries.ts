import { User } from '../../models/user';
import { UserModel } from '../schemas/user-schema';

export const createUser = (user: User): Promise<User> => UserModel.create(user);

export const findUserById = (id: string) => UserModel.findById(id);
