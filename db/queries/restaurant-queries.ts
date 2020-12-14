import { RestaurantModel } from '../schemas/restaurant-schema';
import {Restaurant} from "../../models/restaurant";

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
