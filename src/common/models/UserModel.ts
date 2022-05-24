import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize';
import { UserRoles, UserStatus } from '../../modules/auth/types/auth';
import { UsersAttributes, UsersCreation } from '../types/common';
import ClientModel from './ClientModel';
import LoginAttemptsModel from './LoginAttemptsModel';

class UserModel extends Model<UsersAttributes | UsersCreation> {
  declare id: number;
  declare password: string;
  declare roles: UserRoles | string;
  declare status: UserStatus | string;
  declare email: string;
  declare created_at: Date;
  declare recent_login_time: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    roles: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: UserRoles.CLIENT,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: UserStatus.INITIAL,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    recent_login_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
    sequelize,
  }
);

UserModel.hasOne(LoginAttemptsModel, {
  as: 'attempts',
  foreignKey: 'user_id',
});

UserModel.hasOne(ClientModel, {
  as: 'info',
  foreignKey: 'user_id',
});

export default UserModel;
