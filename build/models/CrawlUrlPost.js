"use strict";

var mongoose = require('mongoose');

var crawlPostDataSchema = new mongoose.Schema({
  createTime: Date,
  uploadTime: Date,
  img: String,
  postUrl: String,
  postDetails: [{
    type: mongoose.Types.ObjectId,
    ref: "PostDetail"
  }],
  url: {
    type: String,
    required: true,
    ref: "AccountUrl"
  },
  title: String
});
var CrawlPostData = mongoose.model("CrawlPostData", crawlPostDataSchema);
module.exports = CrawlPostData;