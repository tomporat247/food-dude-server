import { Model, model, Schema } from 'mongoose';
import { Restaurant, RestaurantDocument } from '../../models/restaurant';
import { addressSchemaType } from './common-schema-types';

const restaurantSchema: Schema<Restaurant> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    address: { type: addressSchemaType, required: true },
    imageUrl: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', required: true }],
    reviewsBlocked: { type: Boolean, required: true }
  },
  {
    versionKey: false
  }
);

export const RestaurantModel: Model<RestaurantDocument> = model<RestaurantDocument>('Restaurant', restaurantSchema);
