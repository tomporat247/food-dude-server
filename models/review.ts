import { Document, Types } from 'mongoose';

export interface Review {
  _id?: any;
  userRef: string;
  content: string;
  createdAt: Date;
  restaurantRef: Types.ObjectId;
}

export interface ReviewDocument extends Review, Document {}
