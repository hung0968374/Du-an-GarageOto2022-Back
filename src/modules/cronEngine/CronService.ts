import dayjs from 'dayjs';
import sendGridMail from '../../common/axios/sendGridMail';
import { logger } from '../../common/helpers/logger';
import EmailReminderModel from '../../common/models/EmailReminderModel';
import EmailReminderRepo from '../../common/repositories/EmailReminderRepo';
import UserRepo from '../../common/repositories/UserRepo';
import { EmailStatus } from '../../common/types/common';
import { UserRoles, UserStatus } from '../auth/types/auth';

class CronService {
  async updateUserStatusToActive() {
    const users = await UserRepo.getAllUser();
    for (const user of users) {
      if (user.status === UserStatus.ON_HOLD) {
        user.status = UserStatus.ACTIVE;
        user.save();
      }
    }
  }

  async sendEmailReminder() {
    const inActiveUser = await UserRepo.getUserWithStatus(UserStatus.INACTIVE);
    for (const eachUser of inActiveUser) {
      if (
        eachUser.roles === UserRoles.CLIENT &&
        eachUser.status === UserStatus.INACTIVE
      ) {
        const reminder = await EmailReminderRepo.findByID(eachUser.id);

        if (reminder === null) {
          EmailReminderModel.create({
            email_status: EmailStatus.SENT,
            last_send_time: new Date(),
            user_id: eachUser.id,
          });
        }

        EmailReminderModel.update(
          {
            last_send_time: new Date(),
            email_status: EmailStatus.SENT,
          },
          {
            where: {
              id: eachUser.id,
            },
          }
        );

        await sendGridMail.sendReminderEmail(eachUser.email);
      }
    }

    logger.info('Finish sent mail to remind in-active user');
  }

  async makeUserInactive() {
    const users = await UserRepo.getAllUser();
    for (const user of users) {
      const add5MonthsTime = dayjs(user.recent_login_time).add(5, 'month');
      if (dayjs().isSameOrAfter(add5MonthsTime)) {
        user.status = UserStatus.INACTIVE;
        user.save();
      }
    }

    logger.info('Finish make user in-active');
  }
}

export default new CronService();
