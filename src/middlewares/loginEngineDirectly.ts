import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../common/errors/types/UnaithorizedError';

export default (req: Request, _res: Response, next: NextFunction): void => {
  if (req.headers && req.headers['web-engine-directly']) {
    const loginDirectlyValue = req.headers['web-engine-directly'];
    if (loginDirectlyValue !== 'true') {
            return next(new UnauthorizedError());
    }
    return next();
  }
  return next(new UnauthorizedError());
};
