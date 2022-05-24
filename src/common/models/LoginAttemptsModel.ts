import { Model, DataTypes } from 'sequelize';
import {
  LoginAttemptsCreation,
  LoginAttemptsAttributes,
} from '../types/common';
import sequelize from '../../config/sequelize';

class LoginAttemptsModel extends Model<
  LoginAttemptsAttributes | LoginAttemptsCreation
> {
  declare id: number;
  declare user_id: number;
  declare attempts: number;
  declare start_time: Date;
  declare end_time: Date;
}

LoginAttemptsModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'login_attempts',
    timestamps: false,
    sequelize,
  }
);

export default LoginAttemptsModel;
