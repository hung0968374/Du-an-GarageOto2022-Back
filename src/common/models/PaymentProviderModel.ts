import { Model, DataTypes } from 'sequelize';
import {
  PaymentProviderAttributes,
  PaymentProviderCreation,
} from '../types/common';
import sequelize from '../../config/sequelize';

class PaymentProviderModel extends Model<
  PaymentProviderAttributes | PaymentProviderCreation
> {
  id: number;
  provider: string;
}

PaymentProviderModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: 'payment_provider',
    timestamps: false,
    sequelize,
  }
);

export default PaymentProviderModel;
