import { Document, Types } from 'mongoose';
import { Restaurant } from './restaurant';

export interface Review {
  _id?: any;
  userRef: string;
  content: string;
  createdAt: Date;
  restaurant: Types.ObjectId | Restaurant;
}

export interface ReviewDocument extends Review, Document {}
