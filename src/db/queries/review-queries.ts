import { isNil, omitBy } from 'lodash';
import { ReviewModel } from '../schemas/review-schema';
import { Review } from '../../models/review';
import { RestaurantModel } from '../schemas/restaurant-schema';

export const findReviews = ({ restaurantId, userId }: { restaurantId: string; userId: string }) => {
  const filters = omitBy({ restaurant: restaurantId, user: userId }, isNil);
  return ReviewModel.find(filters).populate('user').populate('restaurant');
};

export const createReview = async (review: Review) => {
  // TODO: Use transaction with session
  const createdReview = await ReviewModel.create(review);
  await RestaurantModel.updateOne({ _id: review.restaurant }, { $addToSet: { reviews: createdReview._id } });
  return createdReview;
};
