import { Model, DataTypes } from 'sequelize';
import { LoginTokenAttributes, LoginTokenCreation } from '../types/common';
import sequelize from '../../config/sequelize';

class LoginTokenModel extends Model<LoginTokenAttributes | LoginTokenCreation> {
  declare id: number;
  declare token: string;
  declare user_id: number;
  declare created_at: Date;
}

LoginTokenModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(255),
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'login_tokens',
    timestamps: false,
    sequelize,
  }
);

export default LoginTokenModel;
