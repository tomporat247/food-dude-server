import { Document } from 'mongoose';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: 'admin' | 'viewer';
  address: {
    city: string;
    street: string;
    houseNumber: number;
  };
}

export interface UserDocument extends User, Document {}

export type UpdateUserArguments = Omit<User, 'passwordHash'>;

export type SignUpUserArguments = Omit<UpdateUserArguments, 'role'> & {
  password: string;
};
export type SignInUserArguments = Omit<Omit<Omit<SignUpUserArguments, 'address'>, 'firstName'>, 'lastName'>;
