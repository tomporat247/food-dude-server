import { Document, Types } from 'mongoose';
import { Address } from '../types/address';
import { Category } from './category';
import { Review } from './review';

export interface Restaurant {
  _id?: any;
  name: string;
  description: string;
  rating: number;
  address: Address;
  imageUrl: string;
  category: Types.ObjectId | Category | string;
  reviews: Types.ObjectId[] | Review[];
}

export type CreateRestaurantBody = Omit<Omit<Restaurant, '_id'>, 'reviews'>;
export type UpdateRestaurantBody = Partial<CreateRestaurantBody>;

export interface RestaurantDocument extends Restaurant, Document {}

/**
 * @swagger
 *  components:
 *    schemas:
 *      Restaurant:
 *        type: object
 *        required:
 *          - _id
 *          - name
 *          - description
 *          - rating
 *          - address
 *          - imageUrl
 *          - category
 *        properties:
 *          _id:
 *            type: string
 *            format: uuid
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          rating:
 *            type: number
 *          address:
 *            type: object
 *            properties:
 *              city:
 *                type: string
 *              street:
 *                type: string
 *              houseNumber:
 *                type: number
 *            required:
 *              - city
 *              - street
 *              - houseNumber
 *          imageUrl:
 *            type: string
 *          category:
 *            $ref: '#/components/schemas/Category'
 *          reviews:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Review'
 *        example:
 *           _id: "xxx"
 *           name: KFC
 *           description: fried chicken goodies
 *           rating: 10
 *           imageUrl: http://some-link
 *           category: some category
 *           address: {city: 'Tel Aviv', street: 'Hashalom', houseNumber: 1}
 *           reviews: [review 1, review 2]
 */
