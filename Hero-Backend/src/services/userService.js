const { Op } = require("sequelize");
const UserModel = require("../models/userModel");
const {
  sendConfirmationEmail,
  sendPasswordResetEmail,
} = require("./emailService");

class UserService {
  async createUser(userData) {
    const user = await UserModel.create(userData);
    const { otp } = await sendConfirmationEmail(user.email, user.id);

    // Save the OTP and its expiration time in the database
    await UserModel.update(
      {
        email_confirmation_otp: otp,
        email_confirmation_otp_expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      },
      { where: { id: user.id } }
    );

    return user;
  }

  async updateUserOTP(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Generate OTP and set expiration
      const { otp } = await sendConfirmationEmail(user.email, user.id);

      // Update user with new OTP
      await UserModel.update(
        {
          email_confirmation_otp: otp,
          email_confirmation_otp_expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
        },
        { where: { id: userId } }
      );

      return user;
    } catch (error) {
      console.error("Error updating user OTP:", error);
      throw error;
    }
  }

  async createGoogleUser(userData) {
    const user = await UserModel.create({
      ...userData,
      email_confirmed: true,
    });
    return user;
  }

  async getUserById(id) {
    return UserModel.findByPk(id);
  }

  async getUserCount() {
    return await UserModel.count();
  }

  async getUserByEmail(email) {
    return UserModel.findOne({ where: { email } });
  }

  async getUserByGoogleId(googleId) {
    return UserModel.findOne({ where: { google_id: googleId.toString() } });
  }

  async getAllUsers({ limit = 10, offset = 0, search = "", role = null }) {
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    const { count, rows } = await UserModel.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
      attributes: {
        exclude: [
          "refresh_token",
          "email_confirmation_otp",
          "email_confirmation_otp_expires",
        ],
      },
    });

    const nextOffset =
      offset + rows.length < count ? parseInt(offset) + parseInt(limit) : null;

    return {
      users: rows,
      totalCount: count,
      nextOffset,
    };
  }

  async updateUser(id, userData) {
    await UserModel.update(userData, { where: { id } });
    return this.getUserById(id);
  }

  async deleteUser(id) {
    return UserModel.destroy({ where: { id } });
  }

  async verifyEmailOTP(userId, otp) {
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email_confirmation_otp: otp,
        email_confirmation_otp_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired OTP");
    }

    user.email_confirmed = true;
    user.email_confirmation_otp = null;
    user.email_confirmation_otp_expires = null;
    await user.save();
    return user;
  }

  async findUserForAuth(identifier) {
    return UserModel.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { google_id: identifier }],
      },
    });
  }

  async revokeRefreshToken(userId) {
    return UserModel.update({ refreshToken: null }, { where: { id: userId } });
  }

  // In userService.js - searchUsers method
  async searchUsers({
    query = "",
    limit = 10,
    offset = 0,
    sortBy = "id",
    sortOrder = "asc",
  }) {
    try {
      console.log("Service received params:", {
        query,
        limit,
        offset,
        sortBy,
        sortOrder,
      });

      // Validate sortBy field exists in model
      const validFields = Object.keys(UserModel.rawAttributes);
      const validatedSortBy = validFields.includes(sortBy) ? sortBy : "id";

      // Construct where clause
      const whereClause = {};
      if (query.trim()) {
        whereClause[Op.or] = [
          { first_name: { [Op.iLike]: `%${query}%` } },
          { last_name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
        ];
      }

      console.log("Final where clause:", whereClause);

      const { count, rows } = await UserModel.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[validatedSortBy, sortOrder.toUpperCase()]],
        attributes: {
          exclude: [
            "password",
            "refresh_token",
            "email_confirmation_otp",
            "email_confirmation_otp_expires",
          ],
        },
      });

      console.log(`Found ${count} results`);

      return {
        users: rows,
        total: count,
      };
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  }

  async getSearchSuggestions({ query, limit }) {
    try {
      const users = await UserModel.findAll({
        where: {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${query}%` } },
            { last_name: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } },
          ],
        },
        limit: parseInt(limit),
        attributes: ["id", "first_name", "last_name", "email"],
        order: [["first_name", "ASC"]],
      });

      return users.map((user) => ({
        id: user.id,
        text: `${user.first_name} ${user.last_name} (${user.email})`,
      }));
    } catch (error) {
      console.error("Error in getSearchSuggestions:", error);
      throw error;
    }
  }
}

module.exports = new UserService();
