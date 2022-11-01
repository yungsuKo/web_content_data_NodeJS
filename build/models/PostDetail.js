"use strict";

var mongoose = require('mongoose');

var postDetailSchema = new mongoose.Schema({
  createTime: Date,
  views: String,
  likes: String,
  comments: String,
  postUrl: {
    type: String,
    required: true,
    ref: "CrawlPostData"
  }
});
var PostDetail = mongoose.model("PostDetail", postDetailSchema);
module.exports = PostDetail;