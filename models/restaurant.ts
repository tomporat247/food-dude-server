import { Document } from 'mongoose';
import { Address } from '../types/address';
import { Review } from './review';

export interface Restaurant {
  _id?: any;
  name: string;
  categoryId: string;
  description: string;
  rating: number;
  address: Address;
  reviews: Review[];
}

export interface RestaurantDocument extends Restaurant, Document {}
