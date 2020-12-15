import { Document } from 'mongoose';

export interface Category {
  _id?: any;
  name: string;
  description: string;
}

export interface CategoryDocument extends Category, Document {}

/**
 * @swagger
 *  components:
 *    schemas:
 *      Category:
 *        type: object
 *        required:
 *          - _id
 *          - name
 *          - description
 *        properties:
 *          _id:
 *            type: string
 *            format: uuid
 *          name:
 *            type: string
 *            description: must be unique
 *          description:
 *            type: string
 *        example:
 *           _id: "xxx"
 *           name: italian
 *           description: pizza, pasta and so much more
 */
