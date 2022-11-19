require("dotenv/config");
require('../db');
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const AccountUrl = require("../models/AccountUrl");
const CrawlUrlPost = require("../models/CrawlUrlPost");
const PostDetail = require("../models/PostDetail");

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
function timestamp() {
    var today = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString();
}
// 최근 7일 이내 발행됩 게시물을 입력 받고, 해당 게시물들의 상세정보를 크롤링한다.
module.exports = async function scheduleDetailCrawler(postEachUrl, platform){
    // 계정별로 for문 돌리고
    // 7일 이내 업로드 된 postUrl을 입력받고,
    // 해당 url에 접근하여 detail 정보를 받아옴.
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        let detailData = {};
        const postData = await CrawlUrlPost.findById(postEachUrl._id);
        // 새로운 페이지를 연다.
        const page = await browser.newPage();
        const createTime = timestamp();
        // 페이지의 크기를 설정한다.
        await page.setViewport({
            width: 1366,
            height: 768,
        });

        let content;
        let $;
        
        if(platform == "naver"){
            await page.goto("https://post.naver.com/"+postEachUrl.postUrl);
            await delay(10);
            content = await page.content();
            $ = cheerio.load(content);
            const raw_views = $('span.se_view').text();
            const views = raw_views.replace("읽음","");
            const likes = $('a#btn_like_end em.u_cnt._cnt').text();
            const comments = $('span.u_cbox_count').text();
            
            detailData = {
                createTime,
                views,
                likes,
                comments,
                postUrl : postEachUrl._id
            };
        }else{
            await page.goto("https:"+postEachUrl.postUrl);
            await delay(10);
            content = await page.content();
            $ = cheerio.load(content);
            const raw_views = $('span.txt_info:nth-child(1)').text();
            const views = String(Number(raw_views.split(' ')[1].replace('만',''))*10000);
            const recommend = Number($('[data-action-type="RECOMMEND"] span.🎬_count_label').text());
            const like = Number($('[data-action-type="LIKE"] span.🎬_count_label').text());
            const impress = Number($('[data-action-type="IMPRESS"] span.🎬_count_label').text());
            const likes = recommend+like+impress;
            detailData = {
                createTime,
                views,
                likes,
                comments:"",
                postUrl : postEachUrl._id
            };
        }
        const detailDataSaved = await PostDetail.insertMany(detailData);
        postData.postDetails.push(detailDataSaved[0]._id);
        await postData.save();

    } catch (e) {
        console.log(e);
    } finally {
        await browser.close();
    }
}