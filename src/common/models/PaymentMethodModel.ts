import { Model, DataTypes } from 'sequelize';
import {
  PaymentMethodAttributes,
  PaymentMethodCreation,
} from '../types/common';
import sequelize from '../../config/sequelize';

class PaymentMethodModel extends Model<
  PaymentMethodAttributes | PaymentMethodCreation
> {
  id: number;
  method: string;
}

PaymentMethodModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: 'payment_method',
    timestamps: false,
    sequelize,
  }
);

export default PaymentMethodModel;
