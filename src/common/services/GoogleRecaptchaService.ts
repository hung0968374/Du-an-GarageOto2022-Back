import { GoogleCaptchaResponse } from './../types/gCaptcha';
import env from '../../config/env';
import axios from 'axios';
import { logger } from '../helpers/logger';

class GoogleRecaptchaService {
  private gRecaptchaSecret: string;
  private gRecaptchaURL: string;
  private gRecaptchaSample: string;
  private gRecaptchaResponse: GoogleCaptchaResponse;

  constructor() {
    this.gRecaptchaSecret = env.googleRecaptchaSecret;
    this.gRecaptchaURL = env.googleRecaptchaDecodeURL;
    //captcha will expired in 2 minutes and this is an example of expired captcha-string
    this.gRecaptchaSample = env.googleRecaptchaSample;
  }

  async verifyRecaptcha(ip: string, captcha?: string): Promise<string> {
    const body = {
      secret: this.gRecaptchaSecret,
      response: captcha || this.gRecaptchaSample || 'sample-test-captcha',
      remoteip: ip,
    };

    logger.info(`Google Recaptcha Verify body info: ${JSON.stringify(body)}`);

    this.gRecaptchaResponse = await axios.post(
      `${this.gRecaptchaURL}?secret=${body.secret}&response=${body.response}&remoteip=${body.remoteip}`,
      body
    );

    const isValid = this.gRecaptchaResponse.data.success;

    if (!isValid) {
      const errorMessage: string[] =
        this.gRecaptchaResponse.data['error-codes'];
      return errorMessage.join(' ,');
    }
    return 'valid';
  }
}

export default new GoogleRecaptchaService();
