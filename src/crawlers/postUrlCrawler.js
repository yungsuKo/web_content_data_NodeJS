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
        await page.goto(`${url.url}`);
        console.log("waiting for loading");
        await delay(1000);
        console.log("loading end");
        // 페이지의 HTML을 가져온다.
        const content = await page.content();
        const $ = cheerio.load(content);
        if(url.platform == "naver"){
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
                    url : url.url
                });
            });
            console.log(list);
            try {
                await CrawlPostData.insertMany(list);
            } catch (e) {
                console.log(e);
            }
        }else{
            const $postLists = $("a.link_column");
            let urlList = [];
            $postLists.each(function (i, elem) {
                urlList[i] = $(this).attr("href");
            });

            let list = [];
            for (let i = 0; i < 20; i++) {
            await page.goto(`https:${urlList[i]}`);
            console.log(`https:${urlList[i]}`);

            const content = await page.content();
            const $ = cheerio.load(content);
            const elements = $(".box_line");

            await delay(1000);

            // 데이터 가공 - uploadTime
            const raw_uploadTime = await elements
                .find(".info_view .txt_info .num_date")
                .text()
                .replace(elements.find("#article_head_view_count").text(), "");
            const fixed_uploadTime = await new Date(raw_uploadTime);
            fixed_uploadTime.setHours(fixed_uploadTime.getHours() + 9);
            const uploadTime = fixed_uploadTime.toISOString();

            // 데이터 가공 - views
            let views = null;
            const raw_views = elements.find("#article_head_view_count").text();
            if (raw_views.includes("만")) {
                // raw_views에서 "만" 문자열 제외 -> 데이터 타입 숫자로 변경 -> 곱하기 10,000
                views = Number(raw_views.replace("만", "")) * 10000;
            } else {
                // raw_views의 데이터 타입을 숫자로 변경
                views = Number(raw_views.replace(",", ""));
            }

            list[i] = new BoonData({
                crawledTime: timestamp(),
                uploadTime,
                // 위에서 가공한 데이터를 끌어다씀
                link: urlList[i],
                img: elements.find("img.thumb_g_article").attr("src"),
                views,
                // 위에서 가공한 데이터를 끌어다씀
                likes: elements
                .find("button[data-action-type='LIKE'] span.🎬_count_label")
                .text(),
                series: "undefined",
                title: elements.find(".tit_view").text().replace("\n", ""),
            });
            console.log(list[i]);
            }

            try {
            await BoonData.insertMany(list);
            } catch (e) {
            console.log(e);
            }
        }
    // const lists = $("#lst_feed > #inner_feed_box");
        return console.log("crawling finished!");
    } catch (error) {
        console.log(error);
    } finally {
        await browser.close();
    }
}