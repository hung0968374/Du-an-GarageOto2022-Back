import { Model, DataTypes } from 'sequelize';
import { CarCommentAttributes, CarCommentCreation } from '../types/common';
import sequelize from '../../config/sequelize';
import UserModel from './UserModel';

class CarCommentModel extends Model<
  CarCommentAttributes | CarCommentCreation
> {}
CarCommentModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'user_id',
    },
    carId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'car_id',
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'car_comment',
    timestamps: true,
    sequelize,
  }
);

CarCommentModel.belongsTo(UserModel, {
  as: 'userInfo',
  foreignKey: 'user_id',
});

export default CarCommentModel;
