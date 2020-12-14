import { Model, model, Schema } from 'mongoose';
import { User, UserDocument } from '../../models/user';
import { addressSchemaType } from './common-schema-types';

const userSchema: Schema<User> = new Schema(
  {
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true },
    address: { type: addressSchemaType, required: true }
  },
  {
    versionKey: false
  }
);

export const UserModel: Model<UserDocument> = model<UserDocument>('users', userSchema);
