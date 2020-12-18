import { Document, Types } from 'mongoose';
import { Restaurant } from './restaurant';
import { User } from './user';

export interface Review {
  _id?: any;
  user: string | Types.ObjectId | User;
  restaurant: string | Types.ObjectId | Restaurant;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewDocument extends Review, Document {}
