const nodeMailer = require("../config/nodemailer");
const User = require("../models/user");
require("dotenv").config();

exports.resetPasswordLink = async (user) => {
  // Defining template that will be used for sending mails
  let htmlString = nodeMailer.renderTemplate(
    { user: user },
    "/Auth/reset_password_template.ejs"
  );

  nodeMailer.transporter.sendMail(
    {
      // from:'17gietuece032@gmail.com',
      from: process.env.NODEMAILER_FROM_USER_EMAIL,
      to: user.email,
      subject: "Password Reset Link - " + user.name,
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }

      return;
    }
  );
};
