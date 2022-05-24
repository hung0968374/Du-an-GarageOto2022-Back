import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../common/errors/types/BadRequestError';
import messages from '../common/messages';

export default (req: Request, _res: Response, next: NextFunction) => {
  const value = req.body;
  if (Object.keys(value).length === 0 && value instanceof Object) {
    return next(
      new BadRequestError(messages.generalMessage.RequestBodyMissing)
    );
  }

  return next();
};
