const UserService = require("../services/userService");

class UserController {
  async createUser(req, res) {
    try {
      const { first_name, last_name, email, role, password } = req.body;
      const user = await UserService.createUser({
        first_name,
        last_name,
        email,
        role,
        password,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { first_name, last_name, email, role, password, user_type } =
        req.body;
      const updatedUser = await UserService.updateUser(id, {
        first_name,
        last_name,
        email,
        role,
        password,
        user_type,
      });
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await UserService.getUserById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const deletedCount = await UserService.deleteUser(id);
      if (deletedCount > 0) {
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateLastSignIn(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedUser = await UserService.updateLastSignIn(id);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
