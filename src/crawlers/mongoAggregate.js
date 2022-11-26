require("dotenv/config");
require("../db");
const CrawlPostData = require("../models/CrawlUrlPost") ;

const testAgg = async() => {
    const postdatas = await CrawlPostData.aggregate([
        {
            $match:{
                $and : [
                    {uploadTime:{$gt: new Date("2022-11-24")}},
                ]
            }
        },
        {
            $group : {
                _id: "$uploadTime",
                items: { $push: "$$ROOT" },
                count: { $sum: 1 }
            }
        }
    ]);
    console.log(postdatas);
}

testAgg();