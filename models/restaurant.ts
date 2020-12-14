import { Document, Types } from 'mongoose';
import { Address } from '../types/address';

export interface Restaurant {
  _id?: any;
  name: string;
  description: string;
  rating: number;
  address: Address;
  categoryRef: Types.ObjectId;
  reviewRefs: Types.ObjectId[];
}

export interface RestaurantDocument extends Restaurant, Document {}
