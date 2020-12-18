import { isNil, omitBy } from 'lodash';
import { ReviewModel } from '../schemas/review-schema';
import { Review } from '../../models/review';

export const findReviews = ({ restaurantId, userId }: { restaurantId: string; userId: string }) => {
  const filters = omitBy({ restaurant: restaurantId, user: userId }, isNil);
  return ReviewModel.find(filters).populate('user').populate('restaurant');
};

export const createReview = (review: Review) => ReviewModel.create(review);
