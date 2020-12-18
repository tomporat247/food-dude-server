import { RestaurantModel } from '../schemas/restaurant-schema';
import { Restaurant } from '../../models/restaurant';
import { ReviewModel } from '../schemas/review-schema';

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
