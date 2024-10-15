import { sequelize, DataTypes } from '../db';

const PostModel = sequelize.define('post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'Post'
  }
});
