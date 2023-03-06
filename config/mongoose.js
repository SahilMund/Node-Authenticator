const mongoose = require("mongoose");
require('dotenv').config();


//connect to the database
mongoose.connect( process.env.DB_URI + process.env.DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//acquire the connection
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

// once the connection is established
db.once("open", function () {
  console.log("Connected to Database :: MongoDB - Node_Auth");
});

module.exports = db;


