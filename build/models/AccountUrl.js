"use strict";

var mongoose = require('mongoose');

var accountUrlSchema = new mongoose.Schema({
  createTime: Date,
  url: String,
  accountId: String,
  accountName: String,
  platform: String,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});
var AccountUrl = mongoose.model("AccountUrl", accountUrlSchema);
module.exports = AccountUrl;