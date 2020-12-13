import { FoodDudeError } from '../models/food-dude-error';
import { NextFunction, Request, Response } from 'express';

const isFoodDudeError = (err: any): err is FoodDudeError => !!err.isFoodDudeError;

export const errorMiddleware = (error: Error | FoodDudeError, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = isFoodDudeError(error) ? error.message : 'Internal Server Error';
  console.log(`error: ${JSON.stringify(error)}`);

  return res.status(isFoodDudeError(error) ? error.status : 500).send(errorMessage);
};
