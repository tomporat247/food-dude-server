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
  reviews: Types.ObjectId[] | Review[] | string[];
  reviewsBlocked: boolean;
}

export type CreateRestaurantBody = Omit<Omit<Omit<Restaurant, '_id'>, 'reviews'>, 'reviewsBlocked'>;
export type UpdateRestaurantBody = Partial<CreateRestaurantBody>;

export interface RestaurantDocument extends Restaurant, Document {}

export type RestaurantSearchProperties = Partial<
  Omit<Omit<Omit<CreateRestaurantBody, 'rating'>, 'imageUrl'>, 'address'> & Address & { minRating: number }
>;
