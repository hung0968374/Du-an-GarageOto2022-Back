import jwt, { Algorithm } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../common/errors/types/UnaithorizedError';
import env from '../config/env';
import { TokenType } from '../modules/auth/types/auth';
import UserRepo from '../common/repositories/UserRepo';
import LoginTokenRepo from '../common/repositories/LoginTokenRepo';
import { TokenDecode } from '../common/types/common';

enum JWTAlgorithm {
  HS256 = 'HS256',
  HS512 = 'HS512',
}

async function validateRefreshTokenInfo(
  user: string,
  jwtToken: string
): Promise<boolean> {
  const currentUser = await UserRepo.findUserByEmail(user);

  if (currentUser === null) {
    return false;
  }

  const { token } = await LoginTokenRepo.getRefreshTokenByUserId(
    currentUser.id
  );
  if (token === null) {
    return false;
  }

  if (token.trim() !== jwtToken.trim()) {
    return false;
  }
  return true;
}

export default async (req: Request, _res: Response, next: NextFunction) => {
  if (req.headers && req.headers.authorization) {
    const jwtToken = req.headers.authorization.split(' ')[1];
    const json = jwt.decode(jwtToken);
    const decodeToken = json as TokenDecode;
    const type = decodeToken.type;

    try {
      const { user } = jwt.verify(jwtToken, env.jwtSecret, {
        algorithms:
          type === TokenType.ACCESS
            ? ([JWTAlgorithm.HS256] as Algorithm[])
            : ([JWTAlgorithm.HS512] as Algorithm[]),
      });

      if (type === TokenType.REFRESH) {
        const passAllCase = await validateRefreshTokenInfo(
          user as string,
          jwtToken
        );
        if (!passAllCase)
          return next(new UnauthorizedError(`${type} Token Expired`));
      }
      return next();
    } catch (error) {
      return next(new UnauthorizedError(`${type} Token Expired`));
    }
  }
  return next(new UnauthorizedError());
};
