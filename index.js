const express = require("express");
const app = express();
require('dotenv').config();

const cookieParser = require("cookie-parser");
const kue = require("kue");

// const port = 8000; // Each services are recognized by PORT numbers
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");

// Passport
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");



// used for session cookie
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const flash = require("connect-flash");
const customMware = require("./config/flash-middleware");

//middleware used to parse the data coming from the ejs form
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//adding static files
app.use(express.static("./assets"));

// to see the kue-dashboard  , uncomment the below code and visit the url --> http://localhost:8000/kue-api/
// app.use("/kue-api/", kue.app);

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "authenticator-app-cookies",
    secret: process.env.COOKIES_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100, //validity - 100 min
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);


// initializing password middleware
app.use(passport.initialize());  // init passport on every route call
app.use(passport.session());  //allow passport to use "express-session"
app.use(passport.setAuthenticatedUser);

// setting up flash middleware
app.use(flash());
app.use(customMware.setFlash);



// use express router
app.use("/", require("./routes"));

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen( process.env.PORT, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${process.env.PORT} ..........`);
});

