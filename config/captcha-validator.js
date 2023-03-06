const request = require("request");

// Setting up custom captcha validator middleware, which will run while sign-up and sign-in
module.exports.captchaValidator = async (req, res, next) => {
  if (
    req.body["g-recaptcha-response"] === undefined ||
    req.body["g-recaptcha-response"] === "" ||
    req.body["g-recaptcha-response"] === null
  ) {
    return req.flash("something went wrong");
  }
 
  const verificationURL =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    process.env.CAPTCHA_SECRET_KEY +
    "&response=" +
    req.body["g-recaptcha-response"] +
    "&remoteip=" +
    req.connection.remoteAddress;

  request(verificationURL, function (error, response, body) {

    // Parsing body to JSON object
    body = JSON.parse(body);

    //  If Captcha is not verified
    if (body.success !== undefined && !body.success) {
      const { "error-codes": errorCode } = body;

      req.flash("error", "Captcha not verified - " + errorCode[0]);
      return res.redirect("/users/sign-in");
    }

    // If everything is good to go, proceed for passport auth
    next();
  });
};
