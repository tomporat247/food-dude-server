import { isNil, omitBy } from 'lodash';
import { ReviewModel } from '../schemas/review-schema';
import { Review } from '../../models/review';
import { addReviewToRestaurant, removeReviewFromRestaurant } from './restaurant-queries';

export const findReviews = ({ restaurantName }: { restaurantName?: string }) => {
  // const relevantRestaurantIds: string[] | undefined = undefined;
  // const filters = omitBy({ restaurant: restaurantId }, isNil);
  // return ReviewModel.find(filters).populate('user');
  return ReviewModel.find().populate('user')
};

export const findPopulatedReview = (reviewId: string) =>
  ReviewModel.findById(reviewId).populate('user').populate('restaurant');

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

export const getUserIdsWithReviews = (): Promise<string[]> =>
  ReviewModel.distinct('user').then(docs => docs.map(doc => doc.toString()));
