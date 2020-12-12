import * as mongoose from 'mongoose';
import { get } from 'nconf';

export const connectToDB = async () => {
  mongoose.connection
    .on('error', err => console.log('DB error', err))
    .on('disconnected', () => console.log('DB disconnected'))
    .once('connected', () => console.log('DB connected'));

  await mongoose
    .connect(get('db:connectionString'), get('db:options'))
    .catch(err => console.log('DB connection error', err));
};
