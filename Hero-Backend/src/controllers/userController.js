const UserService = require("../services/userService");

class UserController {
  async createUser(req, res) {
    try {
      const { email, role } = req.body;
      const user = await UserService.createUser({
        email,
        role,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { first_name, last_name, email, role, user_type, designation } =
        req.body;
      const updatedUser = await UserService.updateUser(id, {
        first_name,
        last_name,
        email,
        role,
        user_type,
        designation,
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
      const { limit = 10, offset = 0, search = "", role = null } = req.query;

      // Input validation
      const parsedLimit = Math.min(parseInt(limit) || 10, 100); // Max 100 items per page
      const parsedOffset = parseInt(offset) || 0;

      if (parsedOffset < 0 || parsedLimit < 1) {
        return res.status(400).json({
          error: "Invalid pagination parameters",
        });
      }

      // if (role && !["user", "admin", "chairman"].includes(role)) {
      //   return res.status(400).json({
      //     error: "Invalid role parameter",
      //   });
      // }

      const result = await UserService.getAllUsers({
        limit: parsedLimit,
        offset: parsedOffset,
        search: search.toString(),
        role,
      });

      res.json(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        error: error.message || "Error fetching users",
      });
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

  async searchUsers(req, res) {
    try {
      // Log incoming request query for debugging
      console.log("Raw query params:", req.query);

      // Parse and validate query parameters
      const query = req.query.query || "";
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || "id";
      const sortOrder = req.query.sortOrder || "asc";

      console.log("Processed parameters:", {
        query,
        page,
        limit,
        offset,
        sortBy,
        sortOrder,
      });

      // Perform the search
      const result = await UserService.searchUsers({
        query,
        limit,
        offset,
        sortBy,
        sortOrder,
      });

      // Format response
      const response = {
        items: result.users,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({
        error: error.message || "Error performing user search",
      });
    }
  }

  async getSearchSuggestions(req, res) {
    try {
      const { query = "", limit = 5 } = req.query;
      const parsedLimit = Math.min(parseInt(limit) || 5, 20); // Max 20 suggestions

      if (!query.trim()) {
        return res.json({ suggestions: [] });
      }

      const suggestions = await UserService.getSearchSuggestions({
        query: query.toString().trim(),
        limit: parsedLimit,
      });

      res.json({ suggestions });
    } catch (error) {
      console.error("Error getting search suggestions:", error);
      res.status(500).json({
        error: error.message || "Error fetching search suggestions",
      });
    }
  }
}

module.exports = new UserController();
