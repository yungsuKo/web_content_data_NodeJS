require("dotenv/config");
require('../db');
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const AccountUrl = require("../models/AccountUrl");
const CrawlUrlPost = require("../models/CrawlUrlPost");
const PostDetail = require("../models/PostDetail");

// 가장 최근의 것만 확인한 후 제외하는 현상있음.

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

// 계정 url을 조회했을 때, DB에 저장되지 않은 게시물 url이 있으면 크롤링하여 저장함
async function schedulePostCrawler(accountUrl){
    let crawlUrlList;
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
        console.log(accountUrl);
        await page.goto(accountUrl.url);
        console.log("waiting for loading");
        await delay(1000);
        console.log("loading end");
        // 페이지의 HTML을 가져온다.
        const content = await page.content();
        const $ = cheerio.load(content);
        
        if(accountUrl.platform == "naver"){
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
        
                list[i] = new CrawlUrlPost({
                    createTime: timestamp(),
                    uploadTime,
                    postUrl: $(this).find("a.link_end").attr("href"),
                    img: $(this).find("a.link_end img").attr("src"),
                    url : url[0].url,
                    title: $(this).find("strong.tit_feed").text().replace("\n", "")
                });
            });
            console.log(list);
            // list 내에 있는 url을 for 문으로 한 번씩 돌림
            for(let i=0; i<list.length; i++){
                const exist = await CrawlUrlPost.exists({postUrl:list[i].postUrl});
                if (exist){
                    list.splice(i,1);
                }
            }
            try {
                crawlUrlList = await CrawlUrlPost.insertMany(list);
            } catch (e) {
                console.log(e);
            }
        }else{
            
            const $postLists = $("a.link_column");
            let urlList = [];
            // 게시물 리스트 페이지에서 모든 게시물의 url을 리스트 형식으로 저장함.
            $postLists.each(function (i, elem) {
                urlList[i] = $(this).attr("href");
            });
            console.log(urlList)
            let list = [];
            for (let i = 0; i < 10; i++) {
                await page.goto(`https:${urlList[i]}`);
                console.log(`https:${urlList[i]}`);

                const content = await page.content();
                const $ = cheerio.load(content);
                const elements = $(".box_line");

                await delay(300);
                // 데이터 가공 - uploadTime
                const raw_uploadTime = await elements
                    .find(".info_view .txt_info .num_date")
                    .text()
                    .replace(elements.find("#article_head_view_count").text(), "");
                const fixed_uploadTime = new Date(raw_uploadTime);
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

                list[i] = new CrawlUrlPost({
                    createTime: timestamp(),
                    uploadTime,
                    img: elements.find("img.thumb_g_article").attr("src"),
                    postUrl: urlList[i],
                    url : accountUrl.url,
                    title: elements.find(".tit_view").text().replace("\n", ""),
                });
                console.log(list[i]);   
            }
            // 여기서 for문 한번 더 돌려서 이미 DB에 있는 배열 값은 날려주자..
            for(let i=0; i<list.length; i++){
                const exist = await CrawlUrlPost.exists({postUrl:list[i].postUrl});
                if (exist){
                    list.splice(i,1);
                }
            }
            console.log(list);
            try {    
                crawlUrlList = await CrawlUrlPost.insertMany(list);
            } catch (e) {
                console.log(e);
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        await browser.close();
    }
}
async function urlPicker() {
  const url = await AccountUrl.findOne({accountId:"2124"});
  return url;
}

urlPicker().then(function(resolvedData){
  schedulePostCrawler(resolvedData);
  }
);