import { serve, setup } from 'swagger-ui-express';
import { Router } from 'express';
import { get } from 'nconf';

export const apiDocsRouter = Router();
const specs = get('swaggerOptions');

// @ts-ignore
apiDocsRouter.use('/', serve, setup(specs, { explorer: true }));
