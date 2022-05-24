import express from 'express';
import { validate } from 'express-validation';
import wrapper from '../../../common/helpers/wrapperController';
import authenticateRegenerate from '../../../middlewares/authenRegenerate';
import authentication from '../../../middlewares/authentication';
import loginEngineDirectly from '../../../middlewares/loginEngineDirectly';
import validateAdmin from '../../../middlewares/validateAdmin';
import validateExpiryToken from '../../../middlewares/validateExpiryToken';
import AuthController from '../controllers/AuthController';
import authRequest from '../request/authRequest';

const router = express.Router();

router.get('/api-check', wrapper(AuthController.apiCheck));

router.post(
  '/user/sign-up',
  [validate(authRequest.signUpBody)],
  wrapper(AuthController.signUpAccount)
);

router.post(
  '/user/sign-up/:token',
  wrapper(AuthController.signUpAccountSuccess)
);

router.post(
  '/admin/sign-up',
  [validateExpiryToken, authentication, validateAdmin],
  wrapper(AuthController.generateAdminAccount)
);

router.post(
  '/log-in',
  [validate(authRequest.signInBody)],
  wrapper(AuthController.login)
);

router.post(
  '/log-in-directly-with-email',
  [loginEngineDirectly],
  wrapper(AuthController.loginDirectly)
);

router.post(
  '/user/password-recover',
  [validate(authRequest.passwordRecover)],
  wrapper(AuthController.passwordRecover)
);

router.post(
  '/user/new-password/:token',
  [validate(authRequest.newPassword)],
  wrapper(AuthController.newPassword)
);

router.post(
  '/gen-new-token',
  [validateExpiryToken, authenticateRegenerate],
  wrapper(AuthController.regenerateAccessToken)
);

export default router;
