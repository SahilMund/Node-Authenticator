const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
require("dotenv").config();

//to generate random passwords while signing up a user and creating a new user in our application
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/user");

// Setting up passport to be able to use strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
      clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },

    function (accessToken, refreshToken, profile, done) {
      /*
        In case of Social Authentications, It checks if the user is already registered or not, if the user is a registered user then login them
        else registered them
      */
      User.findOne({ email: profile.emails[0].value }).exec(async function (
        err,
        user
      ) {
        if (err) {
          console.log("error in google strategy-passport", err);
          return;
        }

        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found, create the user and set it as req.user

          //   Creating a salt, which will be used to hash the password
          const salt = await bcrypt.genSalt(10);

          //   Generating a random password for the user and hashing it and then storing it in the db
          const hashedPassword = await bcrypt.hash(
            crypto.randomBytes(20).toString("hex"),
            salt
          );

          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: hashedPassword,
            },
            function (err, user) {
              if (err) {
                console.log(
                  "error in creating user google strategy-passport",
                  err
                );
                return;
              }

              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
