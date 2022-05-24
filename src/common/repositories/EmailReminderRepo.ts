import EmailReminderModel from '../models/EmailReminderModel';

class EmailReminderRepo {
  async findByID(id: number) {
    return EmailReminderModel.findOne({
      where: {
        id,
      },
    });
  }
}

export default new EmailReminderRepo();
