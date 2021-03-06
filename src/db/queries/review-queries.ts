import { isNil, omitBy } from 'lodash';
import { ReviewModel } from '../schemas/review-schema';
import { Review } from '../../models/review';
import { addReviewToRestaurant, findRestaurantsIdsForName, removeReviewFromRestaurant } from './restaurant-queries';

export const findReviews = async ({ restaurantName }: { restaurantName?: string }) => {
  const relevantRestaurantIds: string[] = [];
  if (restaurantName) {
    relevantRestaurantIds.push(...(await findRestaurantsIdsForName(restaurantName)));
  }

  const filters = omitBy(
    { restaurant: relevantRestaurantIds.length > 0 ? { $in: relevantRestaurantIds } : undefined },
    isNil
  );
  return ReviewModel.find(filters).populate('user');
};

export const findPopulatedReview = (reviewId: string) =>
  ReviewModel.findById(reviewId).populate('user').populate('restaurant');

export const createReview = async (review: Review) => {
  // TODO: Use transaction with session
  const createdReview = await ReviewModel.create(review);
  await addReviewToRestaurant(review.restaurant as string, createdReview._id);
  return findPopulatedReview(createdReview._id);
};

export const updateReviewById = (id: string, update: Partial<Review>) =>
  ReviewModel.findByIdAndUpdate(id, { $set: update }, { new: true }).populate('user').populate('restaurant');

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
