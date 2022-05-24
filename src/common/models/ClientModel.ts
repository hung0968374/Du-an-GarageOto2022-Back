import { Model, DataTypes, Optional } from 'sequelize';
import { ClientAttributes } from '../types/common';
import sequelize from '../../config/sequelize';
import ClientCouponModel from './ClientCouponModel';
import WishListModel from './WishListModel';

class ClientModel extends Model<
  ClientAttributes,
  Optional<ClientAttributes, 'id'>
> {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  dob: Date;
  addressCountry: string;
  addressProvince: string;
  addressDistrict: string;
  addressWard: string;
  addressDetail: string;
  timezone: string;
  stripeCustomerId: string;
  avatar: string;
}

ClientModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    firstName: {
      type: DataTypes.STRING(50),
    },
    lastName: {
      type: DataTypes.STRING(50),
    },
    gender: {
      type: DataTypes.STRING(10),
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
    },
    dob: {
      type: DataTypes.DATE,
    },
    addressCountry: {
      type: DataTypes.STRING(30),
    },
    addressProvince: {
      type: DataTypes.STRING(5),
    },
    addressDistrict: {
      type: DataTypes.STRING(5),
    },
    addressWard: {
      type: DataTypes.STRING(5),
    },
    addressDetail: {
      type: DataTypes.STRING(100),
    },
    timezone: {
      type: DataTypes.STRING(30),
    },
    stripeCustomerId: {
      type: DataTypes.STRING(40),
    },
    avatar: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'client_info',
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

ClientModel.hasMany(ClientCouponModel, {
  as: 'coupons',
  foreignKey: 'client_id',
});

ClientModel.hasMany(WishListModel, {
  as: 'wishlist',
  foreignKey: 'client_id',
});

export default ClientModel;
