"use strict";

var mongoose = require("mongoose");

var postDataSchema = new mongoose.Schema({
  crawledTime: Date,
  uploadTime: Date,
  link: String,
  img: String,
  series: String,
  title: String,
  views: Number,
  likes: Number
});
var PostData = mongoose.model("PostData", postDataSchema);
module.exports = PostData;