import sendGridMail, { MailDataRequired, MailService } from '@sendgrid/mail';
import axios from 'axios';
import dayjs from 'dayjs';
import env from '../../config/env';
import { logger } from '../helpers/logger';
import { UsersAttributes } from '../types/common';

class SendGridMail {
  protected adminEmail: string;
  protected adminName: string;
  protected apiUrl: string;
  protected apiKey: string;
  protected sgMail: MailService = sendGridMail;

  constructor() {
    this.adminEmail = env.sendGridFromEmail;
    this.adminName = env.sendGridFromEmailName;
    this.apiUrl = env.sendGridApiUrl;
    this.apiKey = env.sendGridApiKey;
    this.sgMail.setApiKey(env.sendGridApiKey);
  }

  async sendGridSendTemplatedEmail(
    toEmail: string,
    name: string,
    templateID: string,
    subject: string
  ) {
    try {
      const body = {
        personalizations: [
          {
            to: [
              {
                email: `${toEmail}`,
                name: `${name}`,
              },
            ],
            dynamic_template_data: {
              name: `${name}`,
            },
            subject: `${subject}`,
          },
        ],
        from: {
          email: `${this.adminEmail}`,
          name: `${this.adminName}`,
        },
        reply_to: {
          email: `${this.adminEmail}`,
          name: `${this.adminName}`,
        },
        template_id: templateID,
      };

      await axios.post(this.apiUrl, body, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          contentType: 'application/json',
        },
      });

      logger.info(
        `Send grid mail to Email: ${toEmail} with subject: ${subject} success`
      );
    } catch (error) {
      logger.error(error, {
        reason: 'EXCEPTION at sendGridSendTemplatedEmail()',
      });
      throw new Error(`Send grid email fail error: ${error}`);
    }
  }

  async sendGridSendEmailWithEmbed(
    link: string,
    userEmail: string,
    subject: string,
    templateId: string
  ) {
    try {
      const email: MailDataRequired = {
        from: this.adminEmail,
        to: userEmail,
        personalizations: [
          {
            to: userEmail,
            subject,
            sendAt: dayjs().valueOf(),
            dynamicTemplateData: {
              link,
            },
          },
        ],
        templateId,
      };

      return await this.sgMail.send(email);
    } catch (error) {
      logger.error(error, {
        reason: 'EXCEPTION at sendGridSendEmailWithEmbed()',
      });
    }
  }

  async sendReminderEmail(email: string) {
    const name = email.split('@')[0];
    try {
      await this.sendGridSendTemplatedEmail(
        email,
        name,
        env.sendGridSignUpTemplateId,
        'RE-ACTIVE ACCOUNT WITH GARA-AUTO'
      );

      logger.info(`Send reminder mail success to email: ${email}`);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at sendReminderEmail()' });
      throw new Error(`Send reminder mail fail with error: ${error} `);
    }
  }

  public async sendSignUpTemplate(user: UsersAttributes, token: string) {
    try {
      const message: MailDataRequired = {
        from: this.adminEmail,
        to: user.email,
        personalizations: [
          {
            to: [{ email: user.email }],
            subject: 'Welcome to the Gara-Auto Dream!',
            dynamicTemplateData: {
              email: user.email,
              link: `${env.frontBaseUrl}auth/user/sign-up/validate/${token}`,
            },
          },
        ],
        templateId: env.sendGridSignUpTemplateId,
      };
      const response = (await this.sgMail.send(message))[0];
      logger.info(
        `sendSignUpTemplate returned with status: ${response.statusCode}`
      );
    } catch (error) {
      logger.error(error, {
        reason: 'EXCEPTION: sendSignUpTemplate() ',
      });
      throw new Error(error);
    }
  }

  public async sendPasswordRecoverTemplate(
    user: UsersAttributes,
    token: string
  ) {
    try {
      const message: MailDataRequired = {
        from: this.adminEmail,
        to: user.email,
        personalizations: [
          {
            to: [{ email: user.email }],
            subject: 'Recover password with GARA-AUTO!',
            dynamicTemplateData: {
              email: user.email,
              link: `${env.frontBaseUrl}auth/user/password-recover/validate/${token}`,
            },
          },
        ],
        templateId: env.sendGridPWRecoverTemplateId,
      };
      const response = (await this.sgMail.send(message))[0];
      logger.info(
        `sendPasswordRecoverTemplate returned with status: ${response.statusCode}`
      );
    } catch (error) {
      logger.error(error, {
        reason: 'EXCEPTION: sendPasswordRecoverTemplate() ',
      });
      throw new Error(error);
    }
  }

  public async loginDirectlyTemplate(user: UsersAttributes, token: string) {
    try {
      const message: MailDataRequired = {
        from: this.adminEmail,
        to: user.email,
        personalizations: [
          {
            to: [{ email: user.email }],
            subject: 'Login directly with email',
            dynamicTemplateData: {
              link: `${env.frontBaseUrl}/auth/user/login-directly/validate/${token}`,
            },
          },
        ],
        templateId: env.sendGridLoginTemplateId,
      };
      const response = (await this.sgMail.send(message))[0];
      logger.info(
        `loginDirectlyTemplate returned with status: ${response.statusCode}`
      );
    } catch (error) {
      logger.error(error, {
        reason: 'EXCEPTION: loginDirectlyTemplate() ',
      });
      throw new Error(error);
    }
  }

  public async paymentTemplate(
    mail: string,
    carName: string,
    receiptID: string
  ) {
    try {
      const message: MailDataRequired = {
        from: this.adminEmail,
        to: mail,
        personalizations: [
          {
            to: [{ email: mail }],
            subject: 'Your payment at GARAAUTO',
            dynamicTemplateData: {
              link: `${env.frontBaseUrl}`,
              receiptID,
              carName,
            },
          },
        ],
        templateId: env.sendGridReceiptTemplate,
      };
      const response = (await this.sgMail.send(message))[0];
      logger.info(
        `paymentTemplate returned with status: ${response.statusCode}`
      );
    } catch (error) {
      logger.error(error, {
        reason: 'EXCEPTION: paymentTemplate() ',
      });
      throw new Error(error);
    }
  }
}

export default new SendGridMail();
