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
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
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
        let user = await UserService.getUserByGoogleId(profile.id);
        let isNewUser = false;

        if (!user) {
          const { firstName, lastName } = splitName(profile.displayName);
          user = await UserService.createUser({
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

// Configure Passport Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserService.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        const { accessToken, refreshToken } = generateTokens(user.id);

        // Update user with new refresh token
        await UserService.updateUser(user.id, { refreshToken });

        return done(null, {
          userId: user.id,
          accessToken,
          refreshToken,
          name: user.name,
        });
      } catch (error) {
        return done(error);
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
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = {
  passport,
  generateTokens,
};
