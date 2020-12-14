import { Document } from 'mongoose';
import { Address } from '../types/address';

export interface User {
  _id?: any;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: 'admin' | 'viewer';
  address: Address;
}

export interface UserDocument extends User, Document {}

export type UpdateUserArguments = Omit<User, 'passwordHash'>;

export type SignUpUserArguments = Omit<UpdateUserArguments, 'role'> & {
  password: string;
};
export type SignInUserArguments = Omit<Omit<Omit<SignUpUserArguments, 'address'>, 'firstName'>, 'lastName'>;
