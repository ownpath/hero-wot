import { sequelize, DataTypes } from '../db';

const UserModel = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  hashedPassword: {
    type: DataTypes.STRING(64),
    validate: {
      is: /^[0-9a-f]{64}$/i,
    },
  },
  role: {
    type: DataTypes.ENUM,
    values: ['user', 'admin', 'chairman']
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'User'
  }
});
