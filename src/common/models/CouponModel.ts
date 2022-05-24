import { Model, DataTypes, Optional } from 'sequelize';
import { CouponAttributes } from '../types/common';
import sequelize from '../../config/sequelize';

class CouponModel extends Model<
  CouponAttributes,
  Optional<CouponAttributes, 'id'>
> {
  id: number;
  code: string;
  description: string;
  amount: number;
}

CouponModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
    },
    description: {
      type: DataTypes.TEXT,
    },
    amount: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    tableName: 'coupon',
    timestamps: false,
    sequelize,
  }
);

export default CouponModel;
