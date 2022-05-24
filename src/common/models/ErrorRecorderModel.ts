import { Model, DataTypes } from 'sequelize';
import {
  ErrorRecorderAttributes,
  ErrorRecorderCreation,
} from '../types/common';
import sequelize from '../../config/sequelize';

class ErrorRecorderModel extends Model<
  ErrorRecorderAttributes | ErrorRecorderCreation
> {
  declare id: number;
  declare destination: string;
  declare reason: string;
  declare created_at: Date;
}

ErrorRecorderModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'error_recorder',
    timestamps: false,
    sequelize,
  }
);

export default ErrorRecorderModel;
