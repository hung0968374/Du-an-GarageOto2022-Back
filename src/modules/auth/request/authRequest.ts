import Joi from 'joi';

export default {
  signInBody: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  signUpBody: {
    body: Joi.object({
      firstName: Joi.string().allow(null, ''),
      lastName: Joi.string().allow(null, ''),
      email: Joi.string().required(),
      password: Joi.string().required(),
      gCaptcha: Joi.string().required(),
      roles: Joi.string().optional(),
    }),
  },
  passwordRecover: {
    body: Joi.object({
      email: Joi.string().required(),
    }),
  },
  newPassword: {
    body: Joi.object({
      password: Joi.string().required(),
    }),
  },
};
