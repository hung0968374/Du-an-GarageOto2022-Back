import { WhereOptions } from 'sequelize';
import CarAppearanceModel from '../models/CarAppearanceModel';
import CarModel from '../models/CarModel';
import { CarAttributes } from '../types/common';

class CarRepository {
  async filterBodyTypeAndSeat(conditions: WhereOptions<CarAttributes>) {
    return CarModel.findAll({
      include: {
        model: CarAppearanceModel,
        as: 'carAppearance',
      },
      where: conditions,
    });
  }

  async getPriceAttributeFromDB(brandId: number) {
    return CarModel.findAll({
      where: {
        brandId,
      },
    });
  }

  async getDistinctDesignAttribute(brandId: number) {
    return CarModel.findAll({
      attributes: ['design'],
      group: ['design'], //select distinct
      where: {
        brandId,
      },
    });
  }

  async getDistinctSeatAttribute(brandId: number) {
    return CarModel.findAll({
      attributes: ['seats'],
      group: ['seats'], //select distinct
      where: {
        brandId,
      },
    });
  }
}

export default new CarRepository();
