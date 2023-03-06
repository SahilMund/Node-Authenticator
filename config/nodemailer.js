const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

require('dotenv').config();

// Setting up transporter with Gmail service to be able to send mails to the users
let transporter = nodemailer.createTransport(
  {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587, // for TLS protocol
    secure: false,
    auth: {
      user: process.env.TRANSPORTER_USER_EMAIL,
      pass : process.env.TRANSPORTER_USER_PASSWORD
    },
  },
  (err) => {
    console.log(err);
    return;
  }
);

// defining that we are going to use ejs for mail template and also providing the path for the file
let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailtemplate", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("error in rendering template", err);
        return;
      }

      mailHTML = template;
    }
  );

  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
