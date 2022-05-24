import CarAppearanceModel from '../models/CarAppearanceModel';
import { CarAppearanceCreation, CarAppearanceModifying } from '../types/common';

class CarAppearanceRepository {
  async createNewImgsOfOto(datas: CarAppearanceCreation) {
    return await CarAppearanceModel.create(datas);
  }
  modifyCarImg = async (obj: CarAppearanceModifying, carId: number) => {
    return await CarAppearanceModel.update(obj, {
      where: {
        car_id: carId,
      },
    });
  };
}

export default new CarAppearanceRepository();
