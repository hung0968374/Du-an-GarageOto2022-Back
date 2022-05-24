import dayjs from 'dayjs';
import LoginAttemptsModel from '../models/LoginAttemptsModel';

class LoginAttemptsRepo {
  async createNewRecord(user_id: number) {
    await LoginAttemptsModel.create({
      user_id,
      attempts: 5,
      start_time: new Date(),
      end_time: dayjs(new Date()).add(2, 'h').toDate(),
    });
  }

  async updateRecord(
    user_id: number,
    attempts: number,
    start_time: Date,
    end_time: Date
  ) {
    await LoginAttemptsModel.update(
      {
        attempts,
        start_time,
        end_time,
      },
      {
        where: {
          user_id,
        },
      }
    );
  }

  async getRecordByUserID(user_id: number) {
    return LoginAttemptsModel.findOne({
      where: {
        user_id,
      },
    });
  }
}

export default new LoginAttemptsRepo();
