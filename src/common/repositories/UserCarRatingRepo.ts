import UserCarRatingModel from '../models/UserCarRatingModel';
import { UserCarRatingCreation } from '../types/common';

class UserCarRatingRepo {
  createCarRating(datas: UserCarRatingCreation) {
    return UserCarRatingModel.create(datas);
  }
  getExistedRating(carId: number, userId: number) {
    return UserCarRatingModel.findOne({
      where: {
        carId,
        userId,
      },
    });
  }
  carUpdateRating(datas: UserCarRatingCreation) {
    return UserCarRatingModel.update(datas, {
      where: {
        carId: datas.carId,
        userId: datas.userId,
      },
    });
  }
  getRatingPoints(carId: number) {
    return UserCarRatingModel.findAll({
      where: {
        carId,
      },
    });
  }
  findUpdatedRating(carId: number, userId: number) {
    return UserCarRatingModel.findOne({
      where: {
        carId,
        userId,
      },
    });
  }
}

export default new UserCarRatingRepo();
