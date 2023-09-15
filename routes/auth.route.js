const router = require("express").Router();
const User = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const { registerValidator } = require("../helpers/validators");

router.post(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  passport.authenticate("local", {
    successRedirect: "/",
    successReturnToOrRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get("/login", ensureLoggedOut({ redirectTo: "/" }), (req, res, next) => {
  res.render("login");
});

router.get(
  "/register",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res, next) => {
    res.render("register");
  }
);

router.post(
  "/register",
  ensureLoggedOut({ redirectTo: "/" }),
  registerValidator,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash("error", error.msg);
        });
        res.render("register", {
          email: req.body.email,
          messages: req.flash(),
        });
        return;
      }

      const { email } = req.body;
      const doesExist = await User.findOne({ email });
      if (doesExist) {
        res.redirect("/auth/register");
        return;
      }
      const user = new User(req.body);
      await user.save();
      req.flash(
        "success",
        `${user.email} registered successfully, you can now login`
      );
      res.redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/logout", ensureLoggedIn({ redirectTo: "/" }), (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle any logout errors here
    }
    res.redirect("/");
  });
});

module.exports = router;
