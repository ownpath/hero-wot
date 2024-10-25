// adminRoutes.js
const express = require("express");
const UserService = require("../services/userService");
const { passport, generateTokens } = require("../auth/auth.js");
const roleMiddleware = require("../auth/rolemiddleware.js");

const router = express.Router();

router.put(
  "/promote-to-admin",
  passport.authenticate("jwt", { session: false }),
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { id } = req.body;

      // Check if user exists
      const existingUser = await UserService.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user is already an admin
      if (existingUser.role === "admin") {
        return res.status(400).json({ message: "User is already an admin" });
      }

      // Update user's role to admin
      const updatedUser = await UserService.updateUser(existingUser.id, {
        role: "admin",
      });

      // since we are not using refresh tokens user has to re-login to get a new access token with updated jwt with admin role
      // // Generate new tokens with updated role
      const { accessToken, refreshToken } = generateTokens(updatedUser);

      // // If you're storing refresh tokens in the database, update it
      // await UserService.updateUser(updatedUser.id, { refreshToken });

      res.status(200).json({
        message: "User successfully promoted to admin",
        user: {
          id: updatedUser.id,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        // Include new tokens in response
        // accessToken,
        // refreshToken,
        tokenUpdateRequired: true,
      });
    } catch (error) {
      console.log("what is error", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/verify-admin",
  passport.authenticate("jwt", { session: false }),
  roleMiddleware("admin"), // Your middleware will check req.user.role === "admin"
  async (req, res) => {
    try {
      // If we get here, both the JWT is valid and the user is an admin
      res.status(200).json({
        isAdmin: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
        },
      });
    } catch (error) {
      console.error("Admin verification error:", error);
      res.status(500).json({
        error: "Internal server error",
        isAdmin: false,
      });
    }
  }
);

router.get(
  "/debug-token",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Return the decoded user information from the JWT
    res.json({
      user: req.user,
      message: "Current user details from JWT",
    });
  }
);

module.exports = router;
