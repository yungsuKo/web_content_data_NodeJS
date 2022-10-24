require("../db");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const CrawlPostData = require("../models/CrawlUrlPost")

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

module.exports = async function postUrlCrawl1(url){
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
        // "https://www.goodchoice.kr/product/search/2" URL에 접속한다. (여기어때 호텔 페이지)
        await page.goto(`${url}`);
        console.log("waiting for loading");
        await delay(1000);
        console.log("loading end");
        // 페이지의 HTML을 가져온다.
        const content = await page.content();
        const $ = cheerio.load(content);
        const $postLists = $("div.inner_feed_box");
        let list = [];
        $postLists.each(function (i, elem) {
            const raw_uploadTime = $(this)
                .find("time.date_post")
                .text()
                .replace("\n", "")
                .trim();
            let uploadTime = "";
            if (raw_uploadTime.includes("시간")) {
                const timeOver = Number(raw_uploadTime.replace("시간 전", ""));
                const timeNow = new Date(timestamp());
                uploadTime = timeNow.setHours(timeNow.getHours() - timeOver);
            } else {
                uploadTime = new Date(raw_uploadTime);
                uploadTime.setHours(uploadTime.getHours() + 9);
                uploadTime.toISOString();
            }
    
            list[i] = new CrawlPostData({
                createTime: timestamp(),
                uploadTime,
                postUrl: $(this).find("a.link_end").attr("href"),
                img: $(this).find("a.link_end img").attr("src"),
                url
            });
        });
        console.log(list);
        try {
            await CrawlPostData.insertMany(list);
        } catch (e) {
            console.log(e);
        }
    // const lists = $("#lst_feed > #inner_feed_box");
        return console.log("crawling finished!");
    } catch (error) {
        console.log(error);
    } finally {
        await browser.close();
    }
}