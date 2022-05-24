import { NextFunction, Request, Response } from 'express';
import ForbiddenError from '../common/errors/types/ForbiddenError';
import messages from '../common/messages';
import { UserStatus } from '../modules/auth/types/auth';

export default (req: Request, _res: Response, next: NextFunction) => {
  const { status } = req.user;
  if (status === UserStatus.INITIAL) {
    return next(
      new ForbiddenError(messages.authMessage.AccountHaventActivated)
    );
  }
  if (status === UserStatus.SUSPEND) {
    return next(new ForbiddenError(messages.authMessage.BanAccount));
  }
  return next();
};
