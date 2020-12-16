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

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - _id
 *          - email
 *          - firstName
 *          - lastName
 *          - address
 *        properties:
 *          _id:
 *            type: string
 *            format: uuid
 *          email:
 *            type: string
 *            format: email
 *            description: must be unique
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          role:
 *            type: string
 *            description: viewer or admin
 *          address:
 *            type: object
 *            properties:
 *              city:
 *                type: string
 *              street:
 *                type: string
 *              houseNumber:
 *                type: number
 *            required:
 *              - city
 *              - street
 *              - houseNumber
 *        example:
 *           _id: "xxx"
 *           email: fake@email.com
 *           firstName: John
 *           lastName: Doe
 *           role: viewer
 *           address: {city: 'Tel Aviv', street: 'Hashalom', houseNumber: 1}
 */
