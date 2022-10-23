const mongoose = require('mongoose')

const crawlDataSchema = new mongoose.Schema({
    createTime : Date,
    url : String,
    owner : {type: mongoose.Types.ObjectId, required: true, ref:"User"}
})

const CrawlData = mongoose.model("CrawlData", crawlDataSchema)
module.exports = CrawlData;