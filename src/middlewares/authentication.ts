import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../common/errors/types/UnaithorizedError';
import UserRepo from '../common/repositories/UserRepo';
import { TokenDecode } from '../common/types/common';
import { TokenType } from '../modules/auth/types/auth';

export default async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.headers && req.headers.authorization) {
    const json = jwt.decode(req.headers.authorization.split(' ')[1]);
    const tokenDecode = json as TokenDecode;
    const type = tokenDecode.type;
    const email = tokenDecode.user;

    if (!type || type !== TokenType.ACCESS) {
      return next(new UnauthorizedError());
    }

    if (!email) {
      return next(new UnauthorizedError());
    }

    const user = await UserRepo.findUserByEmail(email);

    if (!user) {
      return next(new UnauthorizedError());
    }

    req.user = user;
    return next();
  }
  return next(new UnauthorizedError());
};
