import { Model, DataTypes } from 'sequelize';
import { CarCommentAttributes, CarCommentCreation } from '../types/common';
import sequelize from '../../config/sequelize';

class CarComment extends Model<CarCommentAttributes | CarCommentCreation> {}

CarComment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
    userId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'user_id',
    },
    mom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'car_comment',
    timestamps: true,
    sequelize,
  }
);

export default CarComment;
