import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';

import BadRequestError from './types/BadRequestError';
import Error from './types/Error';
import ForbiddenError from './types/ForbiddenError';
import InternalServerError from './types/InternalServerError';
import NotFoundError from './types/NotFoundError';

import { logger } from '../helpers/logger';
import HttpError from './types/HttpError';
import response from '../helpers/response';

/**
 * Identify common API http errors and their default error messages
 */
export const errors = {
  BadRequestError,
  Error,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
};

export const isValidationError = (
  candidate: unknown
): candidate is ValidationError =>
  (candidate as ValidationError).details !== undefined;

/**
 * MiddleWares and functionality to handle errors
 */

export const handleRouteNotFound = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new NotFoundError('Method does not exist'));
};

export const handleRequestValidationError = (
  error: ValidationError,
  _req: Request,
  res: Response,
  next: NextFunction
): Response<unknown, Record<string, unknown>> | void => {
  if (error instanceof ValidationError) {
    logger.error(error);
    let message = '';
    if (error.details.body) {
      message = `${
        error.details.body[0].message.replace(/(")/g, '').split('.')[0]
      }.`;
    } else if (error.details.query) {
      message = `${
        error.details.query[0].message.replace(/(")/g, '').split('.')[0]
      }.`;
    }
    return response.error(res, error.statusCode, message);
  }
  return next(error);
};

export const handleCommonHttpError = (
  error: HttpError,
  _req: Request,
  res: Response,
  next: NextFunction
): Response<unknown, Record<string, unknown>> | void => {
  if (error instanceof HttpError) {
    logger.error(error);
    return response.error(res, error.statusCode, error.message);
  }
  return next(error);
};

export const handleServerException = (
  _error: Error,
  _req: Request,
  res: Response
): Response<unknown, Record<string, unknown>> | void => {
  return response.error(res);
};
