const mongoose = require("mongoose");

const boonDataSchema = new mongoose.Schema({
  crawledTime: Date,
  uploadTime: Date,
  link: String,
  img: String,
  series: String,
  title: String,
  views: Number,
  likes: Number
});

const BoonData = mongoose.model("BoonData", boonDataSchema);
module.exports = BoonData;