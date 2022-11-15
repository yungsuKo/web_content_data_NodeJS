require("../db");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const CrawlUrlPost = require("../models/CrawlUrlPost");
const PostDetail = require("../models/PostDetail")

// 게시글 url에서 수집해야하는 데이터
function timestamp() {
    var today = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString();
}

function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
}

module.exports = async function postDetail1(postEachUrl, accountUrl){
    const browser = await puppeteer.launch({
        headless: false,
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
        if(accountUrl.platform == "naver"){
            await page.goto(postEachUrl.postUrl);
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
            console.log("https:"+postEachUrl.postUrl);
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
        console.log(detailDataSaved);
        postData.postDetails.push(detailDataSaved[0]._id);
        await postData.save();
        console.log(postData);

    } catch (e) {
        console.log(e);
    } finally {
        await browser.close();
    }
}