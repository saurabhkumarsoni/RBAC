const { roles } = require("../helpers/constant");
const User = require("../models/user.model");
const { route } = require("./auth.route");
const mongoose = require("mongoose");

const router = require("express").Router();

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    // res.send(users)
    res.render("manage-users", { users });
  } catch (error) {
    next(error);
  }
});

router.get("/user/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid Id");
      res.redirect("/admin/users");
      return;
    }
    const person = await User.findById(id);
    res.render("profile", { person });
  } catch (error) {
    next(error);
  }
});

router.post("/update-role", async (req, res, next) => {
  const { id, role } = req.body;

  // checking for id and role in request body
  if (!id || !role) {
    req.flash("error", "Invalid Request");
    return res.redirect("back");
  }

  //check fir valid mongoose objectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Id");
    return res.redirect("back");
  }
  // CHECK FOR VALID ROLE
  const rolesArray = Object.values(roles);
  if (!rolesArray.includes(role)) {
    req.flash("error", "Invalid Role");
    return res.redirect("back");
  }
  //ADMIN CAN NOT REMOVE HIMSELF AD AN ADMIN
  if (req.user.id === id) {
    req.flash(
      "error",
      "Admin can not remove themselves from Admin, ask another admin."
    );
    return res.redirect("back");
  }

  // FINALLY UPDATE THE USERS
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );
  req.flash("info", `Updated role for ${user.email} to ${user.role}`);

  res.redirect("back");
});

module.exports = router;
