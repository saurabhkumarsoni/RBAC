const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        // username/email does not exist
        if (!user) {
          return done(null, false, {
            message: "Username/email not registered",
          });
        }
        // email exist and now we need to verify the password
        if (!user.verifyPassword(password)) {
          return done(null, false, { message: "Incorrect password!!" });
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.email,
      role: user.role
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});
