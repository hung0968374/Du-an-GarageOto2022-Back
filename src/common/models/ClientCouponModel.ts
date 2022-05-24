import { Model, DataTypes, Optional } from 'sequelize';
import { ClientCouponAttributes } from '../types/common';
import sequelize from '../../config/sequelize';

class ClientCouponModel extends Model<
  ClientCouponAttributes,
  Optional<ClientCouponAttributes, 'id'>
> {
  id: number;
  clientId: number;
  couponId: number;
  carId: number;
  usedAt: Date;
}

ClientCouponModel.init(
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
    couponId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'client_coupon',
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

export default ClientCouponModel;
