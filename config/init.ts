import * as nconf from 'nconf';
import { resolve } from 'path';

nconf
  .argv()
  .env()
  .file({ file: resolve(__dirname, 'config.json') });
