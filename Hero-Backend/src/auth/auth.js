// authConfig.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../services/userService");

const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to generate tokens
const generateTokens = (user) => {
  // Make sure we explicitly include the role in the token payload
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role, // Ensure this is included
  };

  console.log("Generating token with payload:", tokenPayload); // Debug log

  const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  const refreshToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
// Helper function to split name
const splitName = (fullName) => {
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  return { firstName, lastName };
};

// Configure Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : "";

        // First check if a user exists with this email
        const existingUserByEmail = await UserService.getUserByEmail(email);

        if (existingUserByEmail && !existingUserByEmail.google_id) {
          // User exists but hasn't linked their Google account
          return done(null, false, {
            message:
              "An account already exists with this email. Please log in with your email and password.",
            existingEmail: email,
            errorCode: "EMAIL_EXISTS",
          });
        }

        let user = await UserService.getUserByGoogleId(profile.id);
        let isNewUser = false;

        if (!user) {
          const { firstName, lastName } = splitName(profile.displayName);
          user = await UserService.createGoogleUser({
            google_id: profile.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            role: "user",
          });
          isNewUser = true;
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          generateTokens(user.id);

        // Update user with new refresh token
        await UserService.updateUser(user.id, {
          refreshToken: newRefreshToken,
        });

        return done(null, {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          email: user.email,
          accessToken: newAccessToken,
          isNewUser,
        });
      } catch (error) {
        console.error("error from passport google:", error);
        return done(error, null);
      }
    }
  )
);

// Configure Passport JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await UserService.getUserById(jwt_payload.userId);
      if (user) {
        return done(null, {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          email: user.email,
        });
      } else {
        return done(null, false);
      }
    } catch (error) {
      console.log("error from passport?", error);
      return done(error, false);
    }
  })
);

module.exports = {
  passport,
  generateTokens,
};
