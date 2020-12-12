import { Request, Response } from 'express';

export const signIn = (req: Request<any, any, { username: string; password: string }>, res: Response) => {
  const { username, password } = req.body;
  console.log({ username, password });
  res.sendStatus(200);
};

export const signUp = (req: Request<any, any, { username: string; password: string }>, res: Response) => {
  const { username, password } = req.body;
  console.log({ username, password });
  res.sendStatus(200);
};
