import LoginTokenRepo from '../../../common/repositories/LoginTokenRepo';
import env from '../../../config/env';
import { sign, verify } from 'jsonwebtoken';
import { logger } from '../../../common/helpers/logger';
import messages from '../../../common/messages';
import {
  JWTPayloadType,
  TokenType,
  UserRoles,
  UserStatus,
} from '../types/auth';
import UserRepo from '../../../common/repositories/UserRepo';
import {
  generateSaltPassword,
  compareSaltPassword,
} from '../../../common/helpers/bcrypt';
import UserModel from '../../../common/models/UserModel';
import sendGridMail from '../../../common/axios/sendGridMail';
import {
  TimeZone,
  UserIncludeLoginAttempts,
  UsersAttributes,
} from '../../../common/types/common';
import dayjs from 'dayjs';
import LoginAttemptsRepo from '../../../common/repositories/LoginAttempsRepo';
import { compareDate1GreaterDate2 } from '../../../common/helpers/dateTime';
import GoogleRecaptchaService from '../../../common/services/GoogleRecaptchaService';
import ClientModel from '../../../common/models/ClientModel';
import generator from 'generate-password';
import DiceBearService from '../../../common/services/DiceBearService';

class TokenServices {
  protected generateToken = async (email: string, type: TokenType) => {
    try {
      // we want to generate difference algorithm with difference type of token
      // to increase our protection. In our case ACCESS token use HS256 algorithm
      // REFRESH token in other hand use HS512
      let token = '';
      if (type === 'Access') {
        token = sign({ user: email, type: TokenType.ACCESS }, env.jwtSecret, {
          //HS256 - HMAC using SHA-256 hash algorithm
          expiresIn: env.jwtExpiredAccessTokenTime,
        });
      } else {
        token = sign(
          {
            user: email,
            type: TokenType.REFRESH,
          },
          env.jwtSecret,
          {
            // HS512 - HMAC using SHA-512 hash algorithm
            algorithm: 'HS512',
            noTimestamp: true,
            expiresIn: env.jwtExpiredRefreshTokenTime,
          }
        );
      }
      return token;
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at generateToken()' });
      throw new Error(messages.authMessage.NotGenerateToken);
    }
  };

  protected saveRefreshToken = async (user_id: number, token: string) => {
    try {
      return await LoginTokenRepo.generateRefreshToken(token, user_id);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at saveRefreshToken()' });
      throw new Error(messages.authMessage.NotSaveToken);
    }
  };

  protected handleRefreshToken = async (
    user: UserIncludeLoginAttempts | UsersAttributes
  ) => {
    try {
      const tokenExist = await LoginTokenRepo.getRefreshTokenByUserId(user.id);
      if (tokenExist === null) {
        const existedToken = await this.generateToken(
          user.email,
          TokenType.REFRESH
        );
        const newToken = await LoginTokenRepo.generateRefreshToken(
          existedToken,
          user.id
        );

        logger.info(`Generated Refresh Token for user: ${user.email}`);
        return newToken.token;
      }

      let token = '';
      const afterCreated7Days = dayjs(tokenExist.created_at).add(7, 'd');
      const currentTime = dayjs(new Date());

      if (currentTime.diff(afterCreated7Days) > 0) {
        const genToken = await this.generateToken(
          user.email,
          TokenType.REFRESH
        );
        await LoginTokenRepo.updateTokenAndDateById(
          genToken,
          new Date(),
          tokenExist.id
        );

        logger.info(`Updated Refresh Token for user: ${user.email}`);

        token = genToken;
      } else {
        token = tokenExist.token;
      }

      return token;
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at handleRefreshToken()' });
      throw new Error(`EXCEPTION handleTokenRefreshToken(): ${error}`);
    }
  };

  protected async signUpAccountService(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: string,
    gCaptcha: string,
    userIP: string
  ) {
    const arrOfRoles = ['CLIENT', 'EXPERT', 'SALE'];

    if (roles === undefined) roles = UserRoles.CLIENT;
    else {
      if (!arrOfRoles.includes(roles.toUpperCase())) {
        throw new Error(messages.userMessage.RoleDoesntExist);
      }
      roles = roles.toUpperCase();
    }

    const gCaptchaResponse = await GoogleRecaptchaService.verifyRecaptcha(
      userIP,
      gCaptcha
    );

    if (gCaptchaResponse !== 'valid') {
      throw new Error(gCaptchaResponse);
    }

    const userExist = await UserRepo.findUserByEmail(email);

    if (userExist) {
      throw new Error(messages.userMessage.EmailExist);
    }

    password = await generateSaltPassword(password);

    const newUser = await UserModel.create({
      status: UserStatus.INITIAL,
      created_at: new Date(),
      email,
      password,
      roles,
      recent_login_time: null,
    });

    const token = sign({ email: newUser.email }, env.jwtSecret);

    let fileName = null;
    if (firstName || lastName) {
      fileName = firstName + lastName;
    }

    const avatar = await DiceBearService.getRandomAvatarByName(
      fileName,
      newUser.id
    );

    await Promise.all([
      ClientModel.create({
        userId: newUser.id,
        firstName: firstName,
        lastName: lastName,
        gender: '',
        phoneNumber: '',
        dob: null,
        addressCountry: '',
        addressProvince: null,
        addressDistrict: null,
        addressWard: null,
        addressDetail: '',
        timezone: TimeZone.ASIA_SG,
        stripeCustomerId: '',
        avatar,
      }),
      sendGridMail.sendSignUpTemplate(newUser, token),
    ]);
  }

  protected async signUpAccountSuccessService(token: string) {
    const result: JWTPayloadType = verify(token, env.jwtSecret);
    const { email } = result;

    await UserModel.update(
      { status: UserStatus.ACTIVE },
      {
        where: {
          email,
        },
      }
    );
  }

  protected async signUpAdminService(email: string, role: string) {
    const userExist = await UserRepo.findUserByEmail(email);
    if (userExist) {
      throw new Error(messages.userMessage.EmailExist);
    }

    // Password have 8 character include number, uppercase, lowercase.Example password: 90wDDBfG
    const password = generator.generate({
      length: 8,
      numbers: true,
    });

    const hashPassword = await generateSaltPassword(password);

    await UserModel.create({
      status: UserStatus.INITIAL,
      created_at: new Date(),
      email,
      password: hashPassword,
      roles: role.toUpperCase(),
      recent_login_time: null,
    });

    return { email, password, role };

    //sendGrid
  }

  protected loginService = async (email: string, password: string) => {
    const user = await UserRepo.findUserDetailsByEmail(email);
    const { info } = user;

    if (user === null) {
      throw new Error(messages.authMessage.EmailNotExist);
    }

    switch (user.status) {
      case UserStatus.INITIAL:
        throw new Error(messages.authMessage.AccountHaventActivated);
      case UserStatus.SUSPEND:
        throw new Error(messages.authMessage.BanAccount);
      default:
        break;
    }

    if (user.attempts === null) {
      await LoginAttemptsRepo.createNewRecord(user.id);

      logger.info(`Create new Login attempts for user with id: ${user.id}`);
    } else {
      const end_time = user.attempts.end_time;
      const crrDate = new Date();

      if (compareDate1GreaterDate2(crrDate, end_time) === true) {
        await LoginAttemptsRepo.updateRecord(
          user.id,
          7,
          crrDate,
          dayjs(crrDate).add(2, 'h').toDate()
        );

        logger.info(`Update new Login attempts for user with id: ${user.id}`);
      }
    }

    const la = await LoginAttemptsRepo.getRecordByUserID(user.id);

    const correctPassword = await compareSaltPassword(password, user.password);
    if (!correctPassword) {
      if (la.attempts === 0) {
        await UserModel.update(
          {
            status: UserStatus.ON_HOLD,
          },
          {
            where: {
              id: user.id,
            },
          }
        );
      } else {
        la.attempts = la.attempts - 1;
        await la.save();
      }

      throw new Error(messages.authMessage.PasswordNotMatch);
    }
    const accessToken = await this.generateToken(user.email, TokenType.ACCESS);
    const refreshToken = await this.handleRefreshToken(user);

    return { accessToken, refreshToken, info };
  };

  protected loginDirectlyService = async (email: string) => {
    const user = await UserRepo.findUserByEmail(email);

    if (user === null) {
      throw new Error(messages.authMessage.EmailNotExist);
    }

    switch (user.status) {
      case UserStatus.INITIAL:
        throw new Error(messages.authMessage.AccountHaventActivated);
      case UserStatus.SUSPEND:
        throw new Error(messages.authMessage.BanAccount);
      default:
        break;
    }

    const accessToken = await this.generateToken(user.email, TokenType.ACCESS);
    const refreshToken = await this.handleRefreshToken(user);

    return { accessToken, refreshToken };
  };

  protected passwordRecoverService = async (email: string) => {
    const userExist = await UserRepo.findUserDetailsByEmail(email);

    if (!userExist) {
      throw new Error(messages.authMessage.EmailNotExist);
    }

    if (userExist.status !== UserStatus.ACTIVE) {
      throw new Error(messages.authMessage.AccountHaventActivated);
    }

    const token = sign({ email }, env.jwtSecret);

    const user: UsersAttributes = {
      id: userExist.id,
      password: userExist.password,
      roles: userExist.roles,
      status: userExist.status,
      email: userExist.email,
      created_at: userExist.created_at,
      recent_login_time: userExist.recent_login_time,
    };

    sendGridMail.sendPasswordRecoverTemplate(user, token);
  };

  protected newPasswordService = async (token: string, newPassword: string) => {
    const { email } = verify(token, env.jwtSecret);
    newPassword = await generateSaltPassword(newPassword);

    await UserModel.update(
      { password: newPassword },
      {
        where: {
          email,
        },
      }
    );
  };

  protected regenerateAccessTokenService = async (
    token: string,
    user: UsersAttributes
  ) => {
    const loginTokenRecord = await LoginTokenRepo.getRefreshTokenByUserId(
      user.id
    );
    if (token !== loginTokenRecord.token) {
      throw new Error(messages.authMessage.TokenExpired);
    }

    const today = dayjs(new Date());
    const dbDate = dayjs(loginTokenRecord.created_at);

    if (today.diff(dbDate, 'd') > 7) {
      throw new Error(messages.authMessage.TokenExpired);
    }

    return this.generateToken(user.email, TokenType.ACCESS);
  };
}

export default TokenServices;
