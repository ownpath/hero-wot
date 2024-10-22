const express = require("express");
const { passport, generateTokens } = require("../auth/auth.js");
const UserService = require("../services/userService");
const { sendConfirmationEmail } = require("../services/emailService");

const router = express.Router();

// Helper function to create user response object
const createUserResponse = (
  user,
  accessToken,
  refreshToken,
  isNewUser = false,
  message = ""
) => {
  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      email: user.email,
    },
    accessToken,
    refreshToken,
    isNewUser,
    message,
  };
};

// Helper function to redirect to frontend with data
const redirectWithData = (res, data) => {
  const encodedData = encodeURIComponent(JSON.stringify(data));
  res.redirect(`${process.env.FRONTEND_URL}/auth-callback?data=${encodedData}`);
};

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
    const user = req.user;
    const { accessToken, refreshToken } = generateTokens(user);
    const message = user.isNewUser
      ? "Successfully signed up with Google. Welcome!"
      : "Successfully logged in with Google. Welcome back!";
    const responseData = createUserResponse(
      user,
      accessToken,
      refreshToken,
      user.isNewUser,
      message
    );
    redirectWithData(res, responseData);
  }
);

// Email authentication route - handles both login and registration
router.post("/email-auth", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await UserService.getUserByEmail(email);
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      user = await UserService.createUser({
        email,
        role: "user",
      });
      isNewUser = true;
    } else {
      // Update existing user's OTP
      await UserService.updateUserOTP(user.id);
      // // Send verification email
      // await sendConfirmationEmail(user);
    }

    res.status(200).json({
      message: `Verification email sent to ${email}. Please check your inbox.`,
      userId: user.id,
      isNewUser,
      // Redirect to your existing email verification page
      redirectTo: `/verify-email?userId=${user.id}&email=${encodeURIComponent(
        email
      )}`,
    });
  } catch (error) {
    console.log("error deets", error);
    res.status(500).json({
      error: "Authentication failed. Please try again later.",
    });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await UserService.verifyEmailOTP(userId, otp);
    const { accessToken, refreshToken } = generateTokens(user);

    const message = user.first_name
      ? "Welcome back! Login successful."
      : "Welcome! Please complete your profile.";

    const isNewUser = !user.first_name;

    const responseData = createUserResponse(
      user,
      accessToken,
      refreshToken,
      isNewUser,
      message
    );

    res.json(responseData);
  } catch (error) {
    res.status(400).json({
      error: error.message || "Email verification failed. Please try again.",
    });
  }
});

// Refresh token route
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await UserService.getUserById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ error: "Invalid refresh token. Please log in again." });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update user with new refresh token
    await UserService.updateUser(user.id, { refreshToken: newRefreshToken });

    const responseData = createUserResponse(
      user,
      accessToken,
      newRefreshToken,
      false,
      "Token refreshed successfully."
    );
    res.json(responseData);
  } catch (error) {
    res
      .status(401)
      .json({ error: "Token refresh failed. Please log in again." });
  }
});

module.exports = router;
