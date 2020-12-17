import { RestaurantModel } from '../schemas/restaurant-schema';
import { Restaurant } from '../../models/restaurant';

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
  }
  if (populateCategory) {
    restaurantsQuery = restaurantsQuery.populate('category');
  }
  return restaurantsQuery;
};

export const createRestaurant = (restaurant: Restaurant) => RestaurantModel.create(restaurant);

export const updateRestaurantById = (id: string, update: Partial<Restaurant>) =>
  RestaurantModel.findByIdAndUpdate(id, { $set: update }, { new: true });

export const removeRestaurantById = (id: string) => RestaurantModel.findByIdAndRemove(id);

export const findRestaurantsByCategory = (category: string) => RestaurantModel.find({ category });
