import { Model, DataTypes } from 'sequelize';
import {
  CarAppearanceAttributes,
  CarAppearanceCreation,
} from '../types/common';
import sequelize from '../../config/sequelize';

class CarAppearanceModel extends Model<
  CarAppearanceAttributes | CarAppearanceCreation
> {
  id: number;
  car_id: number;
  imgs: string;
  introImgs: string;
  exteriorReviewImgs: string;
  interiorReviewImgs: string;
  newImgs: string;
  newIntroImgs: string;
  newExteriorReviewImgs: string;
  newInteriorReviewImgs: string;
}

CarAppearanceModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imgs: {
      type: DataTypes.TEXT,
    },
    introImgs: {
      type: DataTypes.TEXT,
      field: 'intro_imgs',
    },
    exteriorReviewImgs: {
      type: DataTypes.TEXT,
      field: 'exterior_review_imgs',
    },
    interiorReviewImgs: {
      type: DataTypes.TEXT,
      field: 'interior_review_imgs',
    },
    newImgs: {
      type: DataTypes.TEXT,
      field: 'new_imgs',
    },
    newIntroImgs: {
      type: DataTypes.TEXT,
      field: 'new_intro_imgs',
    },
    newExteriorReviewImgs: {
      type: DataTypes.TEXT,
      field: 'new_exterior_review_imgs',
    },
    newInteriorReviewImgs: {
      type: DataTypes.TEXT,
      field: 'new_interior_review_imgs',
    },
  },
  {
    tableName: 'car_appearance',
    timestamps: false,
    sequelize,
  }
);

export default CarAppearanceModel;
