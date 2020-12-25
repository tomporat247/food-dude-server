import { Category, CategoryDocument, CategorySearchProperties } from '../../models/category';
import { CategoryModel } from '../schemas/category-schema';
import { FilterQuery } from 'mongoose';
import { isNil, omitBy } from 'lodash';
import { RestaurantModel } from '../schemas/restaurant-schema';
import { getCaseInsensitiveContainsFieldFilterQuery } from './utils/common-query-utils';

export const findAllCategories = () => CategoryModel.find();

export const findCategoryById = (id: string) => CategoryModel.findById(id);

export const findCategoryByName = (name: string) => CategoryModel.findOne({ name });

export const createCategory = (category: Category) => CategoryModel.create(category);

export const removeCategoryById = (id: string) => CategoryModel.findByIdAndDelete(id);

export const updateCategoryById = (id: string, update: Partial<Category>) =>
  CategoryModel.findByIdAndUpdate(id, { $set: update }, { new: true });

export const findCategoriesForSearch = async (properties: CategorySearchProperties) => {
  let validCategoryIds = undefined;
  if (properties.minRestaurantAmount) {
    const categoryToRestaurantCount = await RestaurantModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $match: { count: { $gte: +properties.minRestaurantAmount } } }
    ]);
    validCategoryIds = categoryToRestaurantCount.map(({ _id }) => _id);
  }

  const filterQuery: FilterQuery<CategoryDocument> = {
    _id: validCategoryIds ? { $in: validCategoryIds } : undefined,
    name: getCaseInsensitiveContainsFieldFilterQuery(properties.name),
    description: getCaseInsensitiveContainsFieldFilterQuery(properties.description)
  };
  return CategoryModel.find(omitBy(filterQuery, isNil));
};
