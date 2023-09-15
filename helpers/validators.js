const { body } = require("express-validator");
module.exports = {
  registerValidator: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email must be valid email")
      .normalizeEmail()
      .toLowerCase(),
    body("password")
      .trim()
      .isLength(2)
      .withMessage("Password length short, min 2 char require"),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password don not match");
      }
      return true;
    }),
  ],
};
