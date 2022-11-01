"use strict";

var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_KEY);
var db = mongoose.connection;

var handleOpen = function handleOpen() {
  return console.log("connected");
};

db.once("open", handleOpen);
db.once("error", function (err) {
  throw "failed connect to MongoDB";
}); // ------------------------