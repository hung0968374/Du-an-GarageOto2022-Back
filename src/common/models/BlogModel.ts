import { Model, DataTypes } from 'sequelize';
import { BlogAttributes, BlogCreation } from '../types/common';
import sequelize from '../../config/sequelize';

class BlogModel extends Model<BlogAttributes | BlogCreation> {}

BlogModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriptions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descriptionImgs: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'description_imgs',
    },
  },
  {
    tableName: 'blog',
    timestamps: false,
    sequelize,
  }
);

export default BlogModel;
