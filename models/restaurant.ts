import { Document, Types } from 'mongoose';
import { Address } from '../types/address';
import { Category } from './category';
import { Review } from './review';

export interface Restaurant {
  _id?: any;
  name: string;
  description: string;
  rating: number;
  address: Address;
  imageUrl: string;
  category: Types.ObjectId | Category | string;
  reviews: Types.ObjectId[] | Review[];
}

export type CreateRestaurantBody = Omit<Omit<Restaurant, '_id'>, 'reviews'>;

export interface RestaurantDocument extends Restaurant, Document {}
