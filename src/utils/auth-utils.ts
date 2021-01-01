import { verify } from 'jsonwebtoken';
import { FoodDudeError } from '../models/food-dude-error';
import { get } from 'nconf';
import { UserDocument } from '../models/user';

const accessTokenSecret = get('auth:secret');

export const verifyAndDecodeToken = (token: string) =>
  new Promise<UserDocument>((resolve, reject) =>
    verify(token, accessTokenSecret, (err, user: UserDocument) =>
      err ? reject(new FoodDudeError('auth error', 403)) : resolve(user)
    )
  );
