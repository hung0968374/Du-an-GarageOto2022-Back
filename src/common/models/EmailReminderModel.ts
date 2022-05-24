import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize';
import {
  EmailStatus,
  EmailReminderAttributes,
  EmailReminderCreation,
} from '../types/common';

class EmailReminderModel extends Model<
  EmailReminderAttributes | EmailReminderCreation
> {
  declare id: number;
  declare user_id: number;
  declare email_status: EmailStatus;
  declare last_send_time: Date;
}

EmailReminderModel.init(
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
    email_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    last_send_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'email_reminder',
    timestamps: false,
    sequelize,
  }
);

export default EmailReminderModel;
