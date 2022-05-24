/**
 * This file contains all the messages of the app
 */

export default {
  generalMessage: {
    Error: 'There was some error',
    ApiNotExist: 'Method does not exist',
    success: 'Success',
    BadRequest: 'Bad request, invalid query parameter.',
    RequestBodyMissing: 'Required request body is missing',
  },

  authMessage: {
    NotAuthenticate: 'Could not authenticate',
    NotSaveToken: 'Could not save token',
    NotLogin: 'Could not login',
    NotGenerateToken: 'Could not generate token',
    NotLogout: 'Could not logout',
    NotFoundToken: 'Login token not found',
    AccountHaventActivated: `Your account haven't activated! Check your email to activate `,
    BanAccount:
      'Your account have been banned due to some reason please contact to our Support for me details ',
    PasswordNotMatch: `Password doesn't match. Please try again`,
    EmailNotExist: 'This email doesn`t exist. Sign up new account instead!',
    TokenExpired: 'Your login session has expired please log in again',
    IpAddressBeenBlock:
      'Your IP have been blocked for this site. Please contact to year network provider for more details',
  },

  somethingWentWrongMessage: 'Something went wrong please try again later!',

  userMessage: {
    RoleDoesntExist: 'This kind of roles doesnt exist ',
    EmailExist: 'This email have already taken, try a new one instead',
    UpdateWishListSuccess: 'Update wishlist successfully',
    NotHavingProfile: 'You need to have profile to access this function',
  },

  httpMessages: {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    544: 'Unknown HTTP Error',
  },
};
