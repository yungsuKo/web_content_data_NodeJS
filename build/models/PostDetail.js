const mongoose = require('mongoose');

const postDetailSchema = new mongoose.Schema({
    createTime: Date,
    views: String,
    likes: String,
    comments: String,
    postUrl: { type: String, required: true, ref: "CrawlPostData" }
});

const PostDetail = mongoose.model("PostDetail", postDetailSchema);
module.exports = PostDetail;