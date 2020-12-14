import { Document } from 'mongoose';

export interface Review {
  _id?: any;
  userId: string;
  restaurantId: string;
  content: string;
  createdAt: string;
}

export interface ReviewDocument extends Review, Document {}
