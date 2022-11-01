"use strict";

var mongoose = require("mongoose");

var boonDataSchema = new mongoose.Schema({
  crawledTime: Date,
  uploadTime: Date,
  link: String,
  img: String,
  series: String,
  title: String,
  views: Number,
  likes: Number
});
var BoonData = mongoose.model("BoonData", boonDataSchema);
module.exports = BoonData;