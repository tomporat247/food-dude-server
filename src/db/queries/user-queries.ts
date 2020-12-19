import { User, UserDocument, UserSearchProperties } from '../../models/user';
import { UserModel } from '../schemas/user-schema';
import { FilterQuery } from 'mongoose';
import { isNil, omitBy } from 'lodash';

export const doesUserExist = (id: string) => UserModel.exists({ _id: id });

export const getAllUsers = () => UserModel.find();

export const createUser = (user: User) => UserModel.create(user);

export const findUserByEmailAndPassword = (email: string, passwordHash: string) =>
  UserModel.findOne({ email, passwordHash });

export const findUserById = (id: string) => UserModel.findById(id);

export const findAndUpdateUser = (id: string, update: Partial<User>) =>
  UserModel.findByIdAndUpdate(id, { $set: update }, { new: true });

export const findUsersForSearch = (properties: UserSearchProperties) => {
  const filterQuery: FilterQuery<UserDocument> = {
    firstName: properties.firstName ? { $regex: new RegExp(`^.*${properties.firstName}.*`, 'i') } : undefined,
    lastName: properties.lastName ? { $regex: new RegExp(`^.*${properties.lastName}.*`, 'i') } : undefined,
    email: properties.email ? { $regex: new RegExp(`^.*${properties.email}.*`, 'i') } : undefined,
    role: properties.role || undefined,
    'address.area': properties.area || undefined,
    'address.city': properties.city ? { $regex: new RegExp(`^.*${properties.city}.*`, 'i') } : undefined,
    'address.street': properties.street ? { $regex: new RegExp(`^.*${properties.street}.*`, 'i') } : undefined,
    'address.houseNumber': +properties.houseNumber || undefined
  };
  return UserModel.find(omitBy(filterQuery, isNil));
};
