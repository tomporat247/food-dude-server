import * as nconf from 'nconf';
import { resolve } from 'path';

nconf
  .argv()
  .env()
  .file('swagger', { file: resolve(__dirname, 'swagger-config.json') })
  .file('defaults', { file: resolve(__dirname, 'config.json') });
