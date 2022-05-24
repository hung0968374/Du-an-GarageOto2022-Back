import { Model, DataTypes } from 'sequelize';
import {
  UserCommentReactionAttributes,
  UserCommentReactionCreation,
} from '../types/common';
import sequelize from '../../config/sequelize';
import UserModel from './UserModel';
import CarCommentModel from './CarCommentModel';
import CarModel from './CarModel';

class UserCommentReactionModel extends Model<
  UserCommentReactionAttributes | UserCommentReactionCreation
> {}

UserCommentReactionModel.init(
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
    commentId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'comment_id',
    },
    like: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    dislike: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    tableName: 'user_comment_reaction',
    timestamps: false,
    sequelize,
  }
);

UserCommentReactionModel.belongsTo(UserModel, {
  as: 'user',
  foreignKey: 'user_id',
});

UserCommentReactionModel.belongsTo(CarCommentModel, {
  as: 'reaction',
  foreignKey: 'comment_id',
});

CarCommentModel.hasOne(UserCommentReactionModel, {
  as: 'reaction',
  foreignKey: 'comment_id',
});

UserCommentReactionModel.belongsTo(CarModel, {
  as: 'car',
  foreignKey: 'car_id',
});

export default UserCommentReactionModel;
