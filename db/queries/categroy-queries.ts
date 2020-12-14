import { Category } from '../../models/category';
import { CategoryModel } from '../schemas/category-schema';

export const findAllCategories = () => CategoryModel.find();

export const findCategoryById = (id: string) => CategoryModel.findById(id);

export const createCategory = (category: Category) => CategoryModel.create(category);

export const removeCategoryByName = (name: string) => CategoryModel.findOneAndDelete({ name });

export const updateCategoryByName = (name: string, update: Partial<Category>) =>
  CategoryModel.findOneAndUpdate({ name }, { $set: update }, { new: true });
