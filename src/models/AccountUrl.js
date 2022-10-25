const mongoose = require('mongoose')

const accountUrlSchema = new mongoose.Schema({
    createTime: Date,
    url: String,
    accountId: String,
    accountName: String,
    platform: String,
    owner : {type: mongoose.Types.ObjectId, required: true, ref:"User"}
})

const AccountUrl = mongoose.model("AccountUrl", accountUrlSchema)
module.exports = AccountUrl;