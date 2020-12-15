import { Document, Types } from 'mongoose';
import { Restaurant } from './restaurant';
import { User } from './user';

export interface Review {
  _id?: any;
  user: Types.ObjectId | User;
  restaurant: Types.ObjectId | Restaurant;
  content: string;
  createdAt: Date;
}

export interface ReviewDocument extends Review, Document {}

/**
 * @swagger
 *  components:
 *    schemas:
 *      Review:
 *        type: object
 *        required:
 *          - _id
 *          - user
 *          - restaurant
 *          - content
 *          - createdAt
 *        properties:
 *          _id:
 *            type: string
 *            format: uuid
 *          user:
 *            $ref: '#/components/schemas/User'
 *          restaurant:
 *            $ref: '#/components/schemas/Restaurant'
 *          content:
 *            type: string
 *          createdAt:
 *            type: string
 *            format: date
 *        example:
 *           _id: "xxx"
 *           user: some user
 *           restaurant: some restaurant
 *           content: delicious meal
 *           createdAt: nov 23rd 2019
 *           imageUrl: http://some-link
 */
