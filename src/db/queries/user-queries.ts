import { User } from '../../models/user';
import { UserModel } from '../schemas/user-schema';

export const doesUserExist = (id: string) => UserModel.exists({ _id: id });

export const getAllUsers = () => UserModel.find();

export const createUser = (user: User) => UserModel.create(user);

export const findUserByEmailAndPassword = (email: string, passwordHash: string) =>
  UserModel.findOne({ email, passwordHash });

export const findUserById = (id: string) => UserModel.findById(id);

export const findAndUpdateUser = (id: string, update: Partial<User>) =>
  UserModel.findByIdAndUpdate(id, { $set: update }, { new: true });
