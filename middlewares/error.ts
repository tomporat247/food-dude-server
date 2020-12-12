import { FoodDudeError } from '../models/food-dude-error';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (error: Error | FoodDudeError, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = (error as FoodDudeError).isFoodDudeError ? error.message : 'Internal Server Error';
  return res.status(500).send(errorMessage);
};
