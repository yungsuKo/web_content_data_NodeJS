const mongoose = require("mongoose");

const postDataSchema = new mongoose.Schema({
  crawledTime: Date,
  uploadTime: Date,
  link: String,
  img: String,
  series: String,
  title: String,
  views: Number,
  likes: Number,
});

const PostData = mongoose.model("PostData", postDataSchema);
module.exports = PostData;
