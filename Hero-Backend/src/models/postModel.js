const { sequelize, DataTypes } = require("../db");
const UserModel = require("./userModel");

const PostModel = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: UserModel,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("processing", "accepted", "rejected"),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "approved_by",
      references: {
        model: UserModel,
        key: "id",
      },
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "approved_at",
    },
    media: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("media");
        return rawValue || [];
      },
      set(value) {
        this.setDataValue("media", value);
      },
      validate: {
        isValidMediaArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Media must be an array");
          }
          value.forEach((item) => {
            if (!item.type || !item.url) {
              throw new Error("Each media item must have a type and url");
            }
            if (!["image", "audio", "video"].includes(item.type)) {
              throw new Error("Media type must be image, audio, or video");
            }
            if (!/^https?:\/\//.test(item.url)) {
              throw new Error("Invalid URL format in media item");
            }
          });
        },
      },
    },
  },
  {
    tableName: "posts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define associations
PostModel.belongsTo(UserModel, { as: "author", foreignKey: "userId" });
PostModel.belongsTo(UserModel, { as: "approver", foreignKey: "approvedBy" });

module.exports = PostModel;
