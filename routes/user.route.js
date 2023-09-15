const router = require("express").Router();

router.get("/profile", (req, res, next) => {
  console.log("user details", req.user);
  const person = req.user;
  res.render("profile", { person });
});

module.exports = router;
