require("dotenv/config");
require("../db");
const CrawlPostData = require("../models/CrawlUrlPost") ;

// postUrls 배열을 만드는 방법에 대한 재정의가 필요한 것.

const testAgg = async() => {
    let postUrls = [];
    const startDate = new Date("2022-11-20");
    const endDate = new Date("2022-11-24");
    const distinctPosts = await CrawlPostData.distinct("title",
        {
            $and : [
                { url: "https://content.v.daum.net/channel/2124/contents"},
                { uploadTime: { $gte: startDate } },
                { uploadTime: { $lte: endDate } }
            ]
        }
    );
    for(let i = 0; i<distinctPosts.length; i++){
        let x = await CrawlPostData.find({title:distinctPosts}).sort({createTime: 1}).limit(1);
        postUrls.push(x[0]);
    }
    
    console.log(distinctPosts.length);
    console.log(postUrls);
}

testAgg();