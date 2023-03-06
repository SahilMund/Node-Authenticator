const passport = require("passport");
const bcrypt = require("bcrypt");
//using passport - local authentication
const LocalStrategy = require("passport-local").Strategy;
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
require("./passport-google-oauth2-strategy");

const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      // find a user and establish the identity
      User.findOne({ email: email }, async function (err, user) {
        if (err) {
          console.log("Error in finding user --> Passport");
          return done(err);
        }

        //  here in compare function the 2nd parameter is hashed password -> (encrypted_password_stored_in_db , user_entered_password)
        // comparing the entered password with the hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!user || !match) {
          req.flash("error", "Invalid Username/Password");
          // no error but the authentication is failed
          return done(null, false);
        }

        //if no error, pass null in 1st arg in done()
        return done(null, user);
      });
    }
  )
);

/* serializing the user to decide which key is to be kept in the cookies
serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.
encrypting the userid and setting it in the cookies. */

passport.serializeUser(function (user, done) {
  done(null, user);
});

// deserializing the user from the key in the cookies
// deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user --> Passport");
      return done(err);
    }

    return done(null, user);
  });
});

// check if the user is authenticated -- custom middleware
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }
  // if the user is not signed in
  return res.redirect("/users/sign-in");
};

// custom middleware to sent the authenticated users data and send it with response
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
