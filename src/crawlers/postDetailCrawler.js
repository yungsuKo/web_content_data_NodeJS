require("../db");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { ModuleFilenameHelpers } = require("webpack");
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

module.exports = async function postDetail1(url){
    const browser = await puppeteer.launch({
        headless: false,
    });
    try {
        // 새로운 페이지를 연다.
        const page = await browser.newPage();
        // 페이지의 크기를 설정한다.
        await page.setViewport({
            width: 1366,
            height: 768,
        });
        await page.goto(url)
        await delay(1000);
        const content = await page.content();
        const $ = cheerio.load(content);
        if(url.platform == "naver"){
            const raw_views = $('span.se_view').text();
            const likes = $('a#btn_like_end em.u_cnt._cnt').text();
            const comments = $('span.u_cbox_count').text();
            const views = raw_views.replace("읽음","");
        }else{

        }





    }
}