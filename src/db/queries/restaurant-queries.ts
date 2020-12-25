import { RestaurantModel } from '../schemas/restaurant-schema';
import { Restaurant, RestaurantDocument, RestaurantSearchProperties } from '../../models/restaurant';
import { ReviewModel } from '../schemas/review-schema';
import { FilterQuery } from 'mongoose';
import { isNil, omitBy } from 'lodash';
import { getCaseInsensitiveContainsRegExp } from '../../utils/common-utils';
import { getCaseInsensitiveContainsFieldFilterQuery } from './utils/common-query-utils';

export const doesRestaurantExist = (id: string) => RestaurantModel.exists({ _id: id });

export const findRestaurantById = (id: string) => RestaurantModel.findById(id).populate('category').populate('reviews');

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
  const [restaurant] = await Promise.all([
    RestaurantModel.findByIdAndRemove(id),
    ReviewModel.deleteMany({ restaurant: id })
  ]);
  return restaurant;
};

export const findRestaurantsByCategory = (category: string) => RestaurantModel.find({ category });

export const findRestaurantsForSearch = (properties: RestaurantSearchProperties) => {
  const filterQuery: FilterQuery<RestaurantDocument> = {
    name: getCaseInsensitiveContainsFieldFilterQuery(properties.name),
    description: getCaseInsensitiveContainsFieldFilterQuery(properties.description),
    rating: properties.minRating ? { $gte: properties.minRating } : undefined,
    'address.area': properties.area || undefined,
    'address.city': getCaseInsensitiveContainsFieldFilterQuery(properties.city),
    'address.street': getCaseInsensitiveContainsFieldFilterQuery(properties.street),
    'address.houseNumber': +properties.houseNumber || undefined
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
