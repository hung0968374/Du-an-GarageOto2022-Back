import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../common/errors/types/UnaithorizedError';
import UserRepo from '../common/repositories/UserRepo';
import { UserRoles } from '../modules/auth/types/auth';

export default async (req: Request, _res: Response, next: NextFunction) => {
  const { email } = req.user;

  const { roles } = await UserRepo.findUserByEmail(email);
  if (roles === UserRoles.ADMIN) {
    return next();
  }
  return next(new UnauthorizedError());
};
