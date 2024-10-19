// userService.js
const { Op } = require("sequelize");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

class UserService {
  async createUser(userData) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return UserModel.create(userData);
  }

  async getUserById(id) {
    return UserModel.findByPk(id);
  }

  async getUserByEmail(email) {
    return UserModel.findOne({ where: { email } });
  }

  async getUserByGoogleId(googleId) {
    return UserModel.findOne({ where: { google_id: googleId } });
  }

  async findOrCreateGoogleUser(profile) {
    const [user, created] = await UserModel.findOrCreate({
      where: { google_id: profile.id },
      defaults: {
        first_name: profile.name.givenName || profile.displayName.split(" ")[0],
        last_name:
          profile.name.familyName ||
          profile.displayName.split(" ").slice(1).join(" ") ||
          "",
        email: profile.emails[0].value,
        role: "user",
      },
    });
    return { user, created };
  }

  async getAllUsers() {
    return UserModel.findAll();
  }

  async updateUser(id, userData) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await UserModel.update(userData, { where: { id } });
    return this.getUserById(id);
  }

  async deleteUser(id) {
    return UserModel.destroy({ where: { id } });
  }

  async updateRefreshToken(id, refreshToken) {
    return UserModel.update({ refresh_token: refreshToken }, { where: { id } });
  }

  async updateLastSignIn(id) {
    return UserModel.update({ last_sign_in: new Date() }, { where: { id } });
  }

  async findUserByRefreshToken(refreshToken) {
    return UserModel.findOne({ where: { refreshToken } });
  }

  async validatePassword(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
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
}

module.exports = new UserService();
