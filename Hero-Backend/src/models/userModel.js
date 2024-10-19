const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    google_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "chairman"),
      allowNull: false,
    },
    user_type: {
      type: DataTypes.ENUM("family", "friends", "work colleagues"),
      allowNull: true,
      defaultValue: null,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastSignIn: {
      type: DataTypes.DATE,
      field: "last_sign_in",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Note: The update_last_sign_in function in the database
// should be called when updating the lastSignIn field

module.exports = UserModel;
