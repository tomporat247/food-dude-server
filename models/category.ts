import { Document } from 'mongoose';

export interface Category {
  _id?: any;
  name: string;
  description: string;
}

export interface CategoryDocument extends Category, Document {}
