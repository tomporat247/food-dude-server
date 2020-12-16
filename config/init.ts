import * as nconf from 'nconf';
import { resolve } from 'path';

console.log('a', process.env.NODE_ENV);
const configDirectoryPath =
  process.env.NODE_ENV === 'production' ? resolve(__dirname, '../../', 'config') : resolve(__dirname);

nconf
  .argv()
  .env()
  .file('swagger', { file: resolve(configDirectoryPath, 'swagger-config.json') })
  .file('defaults', { file: resolve(configDirectoryPath, 'config.json') });
