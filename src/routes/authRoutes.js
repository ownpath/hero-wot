// authRoutes.js
const express = require("express");
const { passport, generateTokens } = require("../auth/auth.js");
const bcrypt = require("bcrypt");
const UserService = require("../services/userService");

const router = express.Router();

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const { id, first_name, last_name, role, email, accessToken, isNewUser } =
      req.user;
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/completeprofile`);
    redirectUrl.searchParams.append("id", id);
    redirectUrl.searchParams.append("first_name", first_name);
    redirectUrl.searchParams.append("last_name", last_name);
    redirectUrl.searchParams.append("role", role);
    redirectUrl.searchParams.append("email", email);
    redirectUrl.searchParams.append("accessToken", accessToken);
    redirectUrl.searchParams.append("isNewUser", isNewUser);

    res.redirect(redirectUrl.toString());
  }
);

// Local authentication route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user: user,
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.userId,
        name: user.name,
      },
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    });
  })(req, res, next);
});

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserService.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const { accessToken, refreshToken } = generateTokens(newUser.id);

    // Update user with refresh token
    await UserService.updateUser(newUser.id, { refreshToken });

    res.status(201).json({
      message: "Registration successful",

      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh token route
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await UserService.getUserById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id
    );

    // Update user with new refresh token
    await UserService.updateUser(user.id, { refreshToken: newRefreshToken });

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Protected route example
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      message: "You have access to this protected route",
      user: req.user,
    });
  }
);

module.exports = router;
