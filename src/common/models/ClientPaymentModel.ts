import { Model, DataTypes, Optional } from 'sequelize';
import { ClientPaymentAttributes } from '../types/common';
import sequelize from '../../config/sequelize';
import ClientModel from './ClientModel';
import CarModel from './CarModel';

class ClientPaymentModel extends Model<
  ClientPaymentAttributes,
  Optional<ClientPaymentAttributes, 'id'>
> {
  id: number;
  clientId: number;
  carId: number;
  uuid: string;
  quantity: number;
  createdAt: string | Date;
}

ClientPaymentModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    carId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'client_payment',
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

ClientPaymentModel.belongsTo(ClientModel, {
  as: 'info',
  foreignKey: 'client_id',
});

ClientPaymentModel.belongsTo(CarModel, {
  as: 'car',
  foreignKey: 'car_id',
});

export default ClientPaymentModel;
