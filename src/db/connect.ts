import * as mongoose from 'mongoose';
import { get } from 'nconf';

export const connectToDB = async () => {
  mongoose.connection
    .on('error', err => console.log('DB error', err))
    .on('disconnected', () => console.log('DB disconnected'))
    .on('reconnected', () => console.log('DB reconnected'))
    .once('connected', () => console.log('DB connected'));

  await mongoose
    .connect(get('db:connectionString'), get('db:options'))
    .catch(err => console.log('DB connection error', err));
};
