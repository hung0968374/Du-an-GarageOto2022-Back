import { Model, DataTypes } from 'sequelize';
import { CarAttributes, CarCreation } from '../types/common';
import sequelize from '../../config/sequelize';
import CarAppearanceModel from './CarAppearanceModel';
import BrandModel from './BrandModel';

class CarModel extends Model<CarAttributes, CarCreation> {
  id: number;
  brandId: number;
  name: string;
  price: string;
  discountPercent: number;
  design: string;
  engine: string;
  gear: string;
  seats: number;
  capacity: string;
  yearOfManufacture: number;
  introReview: string;
  exteriorReview: string;
  interiorReview: string;
  amenityReview: string;
  safetyReview: string;
}

CarModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'brand_id',
    },
    name: {
      type: DataTypes.STRING(255),
    },
    price: {
      type: DataTypes.STRING(255),
    },
    discountPercent: {
      type: DataTypes.INTEGER,
      field: 'discount_percent',
    },
    design: {
      type: DataTypes.TEXT,
    },
    engine: {
      type: DataTypes.TEXT,
    },
    gear: {
      type: DataTypes.STRING(255),
    },
    seats: {
      type: DataTypes.TEXT,
    },
    capacity: {
      type: DataTypes.STRING(255),
    },
    yearOfManufacture: {
      type: DataTypes.TEXT,
      field: 'year_or_manufacture',
    },
    introReview: {
      type: DataTypes.TEXT,
      field: 'intro_review',
    },
    exteriorReview: {
      type: DataTypes.TEXT,
      field: 'exterior_review',
    },
    interiorReview: {
      type: DataTypes.TEXT,
      field: 'interior_review',
    },
    amenityReview: {
      type: DataTypes.TEXT,
      field: 'amenity_review',
    },
    safetyReview: {
      type: DataTypes.TEXT,
      field: 'safety_review',
    },
  },
  {
    tableName: 'cars',
    timestamps: false,
    sequelize,
  }
);

CarModel.hasOne(CarAppearanceModel, {
  as: 'carAppearance',
  foreignKey: 'car_id',
});

CarModel.hasOne(BrandModel, {
  as: 'brand',
  foreignKey: 'id',
});

export default CarModel;
