import ErrorRecorderModel from '../models/ErrorRecorderModel';

class ErrorRecorderRepo {
  async logger(destination: string, reason: string) {
    ErrorRecorderModel.create({
      created_at: new Date(),
      destination,
      reason,
    });
  }
}

export default new ErrorRecorderRepo();
