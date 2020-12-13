import { User } from '../../models/user';
import { UserModel } from '../schemas/user-schema';

export const createUser = (user: User) => UserModel.create(user);

export const findUserByEmailAndPassword = (email: string, passwordHash: string) =>
  UserModel.findOne({ email, passwordHash });

export const findUserByEmail = (email: string) => UserModel.findOne({ email });
