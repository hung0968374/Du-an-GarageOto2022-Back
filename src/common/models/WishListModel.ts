import { Model, DataTypes, Optional } from 'sequelize';
import { WishListAttributes } from '../types/common';
import sequelize from '../../config/sequelize';
import CarModel from './CarModel';

class WishListModel extends Model<
  WishListAttributes,
  Optional<WishListAttributes, 'id'>
> {
  id: number;
  clientId: number;
  carId: number;
}

WishListModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'wish_list',
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

WishListModel.hasOne(CarModel, {
  as: 'cars',
  foreignKey: 'id',
});

export default WishListModel;
