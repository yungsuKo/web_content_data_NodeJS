"use strict";

var mongoose = require('mongoose');

var crawlPostDataSchema = new mongoose.Schema({
  createTime: Date,
  uploadTime: Date,
  img: String,
  postUrl: String,
  url: {
    type: String,
    required: true,
    ref: "CrawlData"
  },
  title: String
});
var CrawlPostData = mongoose.model("CrawlPostData", crawlPostDataSchema);
module.exports = CrawlPostData;