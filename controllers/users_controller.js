const queue = require("../config/kue");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("../worker/reset-password-worker");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const User = require("../models/user");

// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    // If the user is logged In/authenticated then render the home page
    return res.redirect("/");
  }

  return res.render("user_sign_up", {
    title: "Authenticator APP | Sign Up",
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    // If the user is logged In/authenticated then render the home page
    return res.redirect("/");
  }
  return res.render("user_sign_in", {
    title: "Authenticator APP | Sign In",
  });
};

// get the sign up data and create an user
module.exports.create = async function (req, res) {
  try {
    // Validation to check if both password and confirm password is matching or not
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }

    // Creating hash of the password using bcrypt 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        req.flash("error", err);
        return;
      }

      if (!user) {
        try {
          User.create(
            {
              email: req.body.email,
              name: req.body.name,
              password: hashedPassword,
            },
            function (err, user) {
              if (err) {
                req.flash("error", err);
                return;
              }
              req.flash("success", "You have signed up, login to continue!");
              return res.redirect("/users/sign-in");
            }
          );
        } catch (err) {
          req.flash("error", err);
          return res.redirect("back");
        }
      } else {
        req.flash("error", "Email already exists, Please SignIn to continue");
        return res.redirect("back");
      }
    });
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/");
};

//  For handling logout functionality
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out!");
    return res.redirect("/users/sign-in");
  });
};

//  For handling reset password functionality, Send mail to the user
module.exports.resetPassword = function (req, res) {
  console.log("req.user", req.user);

  const { _id, email, password, name } = req.user;

  // JWT token created with secret and payload , so creating it
  const secret = JWT_SECRET + password;
  const payload = {
    email: email,
    id: _id,
  };

  // Creating a jwt token which will expires in 10 minute
  const token = jwt.sign(payload, secret, { expiresIn: "10m" }); // expires in 10 min

  //  Link with id and token to be used as a end-point for reset-password
  const link = `http://127.0.0.1:8000/users/reset-password-token/${_id}/${token}`;

  const dataToSent = {
    _id,
    email,
    password,
    name,
    link,
  };

  // console.log("*********dataToSent*****", dataToSent);

  //if queue is not present, it will create a new queue and push the job to it, else it will push the job to the queue
  //  Using KUE to send mails [implementing parallel jobs]
  let job = queue.create("resets", dataToSent).save(function (err) {
    if (err) {
      console.log("Error in sending to the queue", err);
      return;
    }
  });

  req.flash("success", "Reset Link sent to your Mail - " + email);

  return res.redirect("/");
};

//  For handling reset-password functionality - Show the Password change page
module.exports.VerifyTokenAndResetPassword = async function (req, res) {
  const { id, token } = req.params;

  // Get the user details
  let users = await User.findOne({ _id: id });

  if (!users) {
    // if user not found
    return req.flash("error", "User Not found..");
  }

  const secret = JWT_SECRET + users.password;

  try {
    jwt.verify(token, secret);
    // If jwt is unable to verify the token then it will throw the error, so we are caching it in the catch block else render the reset-password page
    return res.render("reset-password", {
      title: "Authenticator APP | Sign In",
      email: users.email,
    });
  } catch (error) {
    console.log("name err", error.name + " ," + error.message);
    if (error.name === "TokenExpiredError") {
      req.flash(
        "error",
        "Link/Token Expired, Kindly send another request to reset your password"
      );
      return res.redirect("/");
    }

    req.flash("error", `${error.name} - ${error.message}`);
    return res.redirect("/");
  }
};

//  For handling reset-password functionality -  Change the password and save it to the database
module.exports.ChangePassword = async (req, res) => {
  // console.log("**********", req.body);

  // If password doesn't match
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("back");
  }

  const { id, token } = req.params;

  // Get the user details
  let users = await User.findOne({ _id: id });

  if (!users) {
    return req.flash("error", "User Not found..");
  }

  // Creating hash of the password using bcrypt and then storing it
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Updating the password field
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { password: hashedPassword }
  );

  req.flash("success", "Password Changed Successfully..");

  return res.redirect("/users/sign-out");
};
