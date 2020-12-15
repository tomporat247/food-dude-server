import { Category } from '../../models/category';
import { CategoryModel } from '../schemas/category-schema';

export const findAllCategories = () => CategoryModel.find();

export const findCategoryById = (id: string) => CategoryModel.findById(id);

export const findCategoryByName = (name: string) => CategoryModel.findOne({ name });

export const createCategory = (category: Category) => CategoryModel.create(category);

export const removeCategoryById = (id: string) => CategoryModel.findByIdAndDelete(id);

export const updateCategoryById = (id: string, update: Partial<Category>) =>
  CategoryModel.findByIdAndUpdate(id, { $set: update }, { new: true });
