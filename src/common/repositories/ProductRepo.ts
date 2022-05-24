import BrandModel from '../models/BrandModel';
import CarAppearanceModel from '../models/CarAppearanceModel';
import CarModel from '../models/CarModel';
import { CarCreation, GetOneCarReturn } from '../types/common';
import { Sequelize } from 'sequelize';

class ProductRepository {
  async createNewOto(attributes: CarCreation) {
    return CarModel.create(attributes);
  }

  getAllCars = async () => {
    return CarModel.findAll({
      include: {
        model: CarAppearanceModel,
        as: 'carAppearance',
      },
    });
  };

  getCarById = async (id: number) => {
    return CarModel.findOne({
      include: {
        model: CarAppearanceModel,
        as: 'carAppearance',
      },
      offset: id,
    });
  };

  getCarByName = async (name: string) => {
    return CarModel.findOne({
      include: {
        model: CarAppearanceModel,
        as: 'carAppearance',
      },
      where: {
        name,
      },
    });
  };

  getCarsByBrandId = async (id: number) => {
    return CarModel.findAll({
      include: {
        model: CarAppearanceModel,
        as: 'carAppearance',
      },
      where: {
        brandId: id,
      },
    });
  };
  getAmountOfCars = async (brandId: number) => {
    return CarModel.count({
      where: {
        brandId,
      },
    });
  };

  async getCurrentCarById(id: number) {
    const car = await CarModel.findOne({
      attributes: [
        'id',
        'name',
        'price',
        'discountPercent',
        'design',
        'engine',
        'gear',
        'seats',
        'capacity',
        'yearOfManufacture',
        [Sequelize.col('carAppearance.imgs'), 'imgs'],
        [Sequelize.col('brand.name'), 'brand'],
      ],
      where: {
        id,
      },
      include: [
        {
          model: CarAppearanceModel,
          as: 'carAppearance',
          attributes: ['imgs'],
        },
        { model: BrandModel, as: 'brand', attributes: ['name'] },
      ],
      raw: true,
    });

    delete car['carAppearance.imgs'];
    delete car['brand.name'];

    try {
      const totalPic = JSON.parse(car['imgs']);
      car['imgs'] = totalPic[0];
    } catch (error) {
      console.log('error: ', error);
    }

    return car as unknown as GetOneCarReturn;
  }
}

export default new ProductRepository();
