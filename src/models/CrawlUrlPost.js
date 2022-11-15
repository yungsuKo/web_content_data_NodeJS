const mongoose = require('mongoose')

const crawlPostDataSchema = new mongoose.Schema({
    createTime : Date,
    uploadTime : Date,
    img : String,
    postUrl : String,
    postDetails : [{type: mongoose.Types.ObjectId, ref:"PostDetail"}],
    url : {type: String, required: true, ref:"AccountUrl"},
    title: String
})

const CrawlPostData = mongoose.model("CrawlPostData", crawlPostDataSchema)
module.exports = CrawlPostData;