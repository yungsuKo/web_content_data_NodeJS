import "dotenv/config";
import "./db";
import app from "./server";
import AccountUrl from "./models/AccountUrl";
import CrawlUrlPost from "./models/CrawlUrlPost";
import PostDetail from "./models/PostDetail";
import schedulePostCrawler from "./crawlers/schedulePostCrawler";
import scheduleDetailCrawler from "./crawlers/scheduleDetailCrawler";

const schedule = require("node-schedule");
const { now } = require("mongoose");

var job = schedule.scheduleJob("00 00 13 * * *", async function () {
    let mNow = new Date();
    mNow.setDate(mNow.getDate()-7);
    // mNow는 시작일로부터 7일 이전의 값을 의미함. 
    console.log(mNow.toString());
    const accountUrls = await AccountUrl.find({});
    for (let i=0; i<accountUrls.length; i++){
        // 계정 url을 하나씩 순회하여 게시물 정보를 업데이트함
        // 포스트 db에서 계정 url을 기준으로 뽑음
        console.log(accountUrls[i]);
        await schedulePostCrawler(accountUrls[i]);

        const postUrls = await CrawlUrlPost.find({
            uploadTime:{$gt : mNow},
            url : accountUrls[i].url
        });
        for (let j=0; j<postUrls.length; j++){ 
            await scheduleDetailCrawler(postUrls[j], accountUrls[i].platform);
        }
    }
});
const port = process.env.PORT || 80;

const handleListening = () =>
    console.log(`✅ server listening from http://localhost:${port} 🚀`);
app.listen(port, handleListening);