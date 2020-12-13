import { Document } from 'mongoose';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  address: {
    city: string;
    street: string;
    houseNumber: number;
  };
}

export interface UserDocument extends User, Document {}

export type SignUpUserArguments = Omit<User, 'passwordHash'> & {
  password: string;
};
export type SignInUserArguments = Omit<Omit<Omit<SignUpUserArguments, 'address'>, 'firstName'>, 'lastName'>;
