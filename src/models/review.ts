import { Document, Types } from 'mongoose';
import { Restaurant } from './restaurant';
import { User } from './user';

export interface Review {
  _id?: any;
  user: Types.ObjectId | User;
  restaurant: Types.ObjectId | Restaurant;
  content: string;
  createdAt: Date;
}

export interface ReviewDocument extends Review, Document {}
