import { Model, model, Schema } from 'mongoose';
import { Restaurant, RestaurantDocument } from '../../models/restaurant';
import { addressSchemaType } from './common-schema-types';

const restaurantSchema: Schema<Restaurant> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    address: { type: addressSchemaType, required: true },
    categoryRef: { type: Schema.Types.ObjectId, required: true },
    reviewRefs: { type: [Schema.Types.ObjectId], required: true }
  },
  {
    versionKey: false
  }
);

export const RestaurantModel: Model<RestaurantDocument> = model<RestaurantDocument>('restaurants', restaurantSchema);
