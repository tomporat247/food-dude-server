import { isNil, omitBy } from 'lodash';
import { ReviewModel } from '../schemas/review-schema';
import { Review } from '../../models/review';
import { addReviewToRestaurant, removeReviewFromRestaurant } from './restaurant-queries';

export const findReviews = ({ restaurantId, userId }: { restaurantId: string; userId: string }) => {
  const filters = omitBy({ restaurant: restaurantId, user: userId }, isNil);
  return ReviewModel.find(filters).populate('user');
};

export const createReview = async (review: Review) => {
  // TODO: Use transaction with session
  const createdReview = await ReviewModel.create(review);
  await addReviewToRestaurant(review.restaurant as string, createdReview._id);
  return createdReview;
};

export const updateReviewById = (id: string, update: Partial<Review>) =>
  ReviewModel.findByIdAndUpdate(id, { $set: update }, { new: true });

export const removeReviewById = async (id: string) => {
  // TODO: Use transaction with session
  const review = await ReviewModel.findByIdAndRemove(id);
  if (review) {
    await removeReviewFromRestaurant(review.restaurant as string, id);
  }
  return review;
};

export const deleteAllRestaurantReviews = (restaurantId: string) =>
  ReviewModel.deleteMany({ restaurant: restaurantId });
