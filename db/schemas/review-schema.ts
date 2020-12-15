import { Model, model, Schema } from 'mongoose';
import { Review, ReviewDocument } from '../../models/review';

const reviewSchema: Schema<Review> = new Schema(
  {
    userRef: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }
  },
  {
    versionKey: false
  }
);

export const ReviewModel: Model<ReviewDocument> = model<ReviewDocument>('Review', reviewSchema);