import { User } from '../../models/user';
import { UserModel } from '../schemas/user-schema';

export const getAllUsers = () => UserModel.find();

export const createUser = (user: User) => UserModel.create(user);

export const findUserByEmailAndPassword = (email: string, passwordHash: string) =>
  UserModel.findOne({ email, passwordHash });

export const findUserByEmail = (email: string) => UserModel.findOne({ email });

export const findAndUpdateUser = (email: string, update: Partial<User>) =>
  UserModel.findOneAndUpdate({ email }, { $set: update }, { new: true });
