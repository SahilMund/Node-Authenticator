const express = require("express");

const router = express.Router();
const homeController = require("../controllers/home_controller");
const passport = require("passport");

// home route, Only the logged in users can visit it at this is a protected route
router.get(
  "/",
  passport.checkAuthentication,
  homeController.home
);

router.use("/users", require("./users"));

module.exports = router;
