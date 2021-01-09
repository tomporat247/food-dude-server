import { RestaurantModel } from '../schemas/restaurant-schema';
import { Restaurant, RestaurantDocument, RestaurantSearchProperties } from '../../models/restaurant';
import { FilterQuery, Types } from 'mongoose';
import { isNil, omitBy } from 'lodash';
import { getCaseInsensitiveContainsRegExp } from '../../utils/common-utils';
import { getCaseInsensitiveContainsFieldFilterQuery } from './utils/common-query-utils';
import { deleteAllRestaurantReviews } from './review-queries';
import { Address } from '../../types/address';

export const doesRestaurantExist = (id: string) => RestaurantModel.exists({ _id: id });

export const findRestaurantById = (id: string) =>
  RestaurantModel.findById(id)
    .populate('category')
    .populate({ path: 'reviews', populate: { path: 'user' } });

export const findAllRestaurants = ({
  populateReviews,
  populateCategory
}: {
  populateReviews?: boolean;
  populateCategory?: boolean;
} = {}) => {
  let restaurantsQuery = RestaurantModel.find({});

  if (populateReviews) {
    restaurantsQuery = restaurantsQuery.populate('reviews');
  } else {
    restaurantsQuery = restaurantsQuery.select(['-reviews']);
  }

  if (populateCategory) {
    restaurantsQuery = restaurantsQuery.populate('category');
  }

  return restaurantsQuery;
};

export const createRestaurant = (restaurant: Restaurant) => RestaurantModel.create(restaurant);

export const updateRestaurantById = (id: string, update: Partial<Restaurant>) =>
  RestaurantModel.findByIdAndUpdate(id, { $set: update }, { new: true });

export const removeRestaurantById = async (id: string) => {
  // TODO: User transaction with session
  const [restaurant] = await Promise.all([RestaurantModel.findByIdAndRemove(id), deleteAllRestaurantReviews(id)]);
  return restaurant;
};

export const findRestaurantsByCategory = (category: string) => RestaurantModel.find({ category });

export const findRestaurantsForSearch = (properties: RestaurantSearchProperties & { address?: Address }) => {
  const filterQuery: FilterQuery<RestaurantDocument> = {
    name: getCaseInsensitiveContainsFieldFilterQuery(properties.name),
    description: getCaseInsensitiveContainsFieldFilterQuery(properties.description),
    rating: properties.minRating ? { $gte: properties.minRating } : undefined,
    'address.area': properties?.address?.area || undefined,
    'address.city': getCaseInsensitiveContainsFieldFilterQuery(properties?.address?.city),
    'address.street': getCaseInsensitiveContainsFieldFilterQuery(properties?.address?.street),
    'address.houseNumber': +properties?.address?.houseNumber || undefined
  };
  return RestaurantModel.find(omitBy(filterQuery, isNil))
    .populate({
      path: 'category',
      match: properties.category
        ? { name: { $regex: getCaseInsensitiveContainsRegExp(properties.category) } }
        : undefined
    })
    .select(['-reviews'])
    .then(restaurants => restaurants.filter(restaurant => restaurant.category !== null));
};

export const aggregateCategoryToRestaurantAmount = (additionalAggregators: any[] = []) =>
  RestaurantModel.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, ...additionalAggregators]);

export const addReviewToRestaurant = (restaurantId: string | Types.ObjectId, reviewId: string | Types.ObjectId) =>
  RestaurantModel.updateOne({ _id: restaurantId }, { $addToSet: { reviews: reviewId } });

export const removeReviewFromRestaurant = (restaurantId: string | Types.ObjectId, reviewId: string | Types.ObjectId) =>
  RestaurantModel.updateOne({ _id: restaurantId }, { $pull: { reviews: reviewId } });

export const getCategoryToAverageRestaurantRating = (): Promise<Record<string, number>> =>
  RestaurantModel.aggregate([{ $group: { _id: '$category', averageRating: { $avg: '$rating' } } }]).then(result =>
    result.reduce((acc, { _id, averageRating }) => {
      acc[_id.toString()] = averageRating;
      return acc;
    }, {})
  );
// RestaurantModel.mapReduce({
//   map: 'category',
//   reduce: (key, restaurants) => mean(restaurants.map(restaurant => restaurant.rating))
// });
