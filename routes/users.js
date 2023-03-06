const express = require("express");
const router = express.Router();
const passport = require("passport");

const captcha = require("../config/captcha-validator");
const usersController = require("../controllers/users_controller");

// sign-in & sign-up route
router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);

// Creating a user on signup, enabling captcha validation
router.post("/create", captcha.captchaValidator, usersController.create);

// using captcha validation and passport as a middleware to authenticate
router.post(
  "/create-session",
  captcha.captchaValidator,
  passport.authenticate('local', { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

// Logout route
router.get("/sign-out", passport.checkAuthentication , usersController.destroySession);

//  routes to handle reset password --Protected routes
router.get("/reset-password/",passport.checkAuthentication, usersController.resetPassword);
router.get(
  "/reset-password-token/:id/:token",
  passport.checkAuthentication,
  usersController.VerifyTokenAndResetPassword
);
router.post("/reset-password-token/:id/:token",passport.checkAuthentication, usersController.ChangePassword);

//Google -  Social Oauth , SCOPE :- is the information that we want to fetch
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

module.exports = router;
