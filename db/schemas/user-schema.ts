import { Schema, Model, model } from 'mongoose';
import { User, UserDocument } from '../../models/user';

const userSchema: Schema<User> = new Schema(
  {
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    address: {
      type: {
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNumber: {
          type: Number,
          min: 1,
          required: true
        }
      },
      required: true
    }
  },
  {
    versionKey: false
  }
);

export const UserModel: Model<UserDocument> = model<UserDocument>('users', userSchema);
