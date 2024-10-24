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
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "first_name",
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    role: {
      type: DataTypes.ENUM("user", "admin", "chairman"),
      allowNull: false,
      defaultValue: "user",
    },
    user_type: {
      type: DataTypes.ENUM(
        "family",
        "friends",
        "team hero",
        "business partners",
        "proud hero owner"
      ),
      allowNull: true,
      defaultValue: null,
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastSignIn: {
      type: DataTypes.DATE,
      field: "last_sign_in",
    },
    email_confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    email_confirmation_otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
      validate: {
        is: /^[0-9]{6}$/,
      },
    },
    email_confirmation_otp_expires: {
      type: DataTypes.DATE,
      allowNull: true,
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
