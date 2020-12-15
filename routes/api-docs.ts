import * as swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { Router } from 'express';
import { get } from 'nconf';

const serverUrl = get('serverUrl');

const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FoodDude API with Swagger',
      version: '1.0.0',
      description: 'This is a CRUD and authentication API for the FoodDude application'
    },
    servers: serverUrl
      ? [
          {
            url: serverUrl
          }
        ]
      : undefined
  },
  apis: ['./*.*']
});

export const apiDocsRouter = Router();

// @ts-ignore
apiDocsRouter.use('/', serve, setup(specs, { explorer: true }));
