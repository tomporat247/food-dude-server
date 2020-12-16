import { Schema, Model, model } from 'mongoose';
import { Category, CategoryDocument } from '../../models/category';

const categorySchema: Schema<Category> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

export const CategoryModel: Model<CategoryDocument> = model<CategoryDocument>('Category', categorySchema);
