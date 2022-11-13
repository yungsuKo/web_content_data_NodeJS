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
        // URL에 접속한다.
        console.log(accountUrl);
        await page.goto(accountUrl.url);
        console.log("waiting for loading");
        await delay(1000);
        console.log("loading end");
        // 페이지의 HTML을 가져온다.
        const content = await page.content();
        const $ = cheerio.load(content);

        const $postLists = $("a.link_column");
        // 게시물 리스트 페이지에서 모든 게시물의 url을 리스트 형식으로 저장함.
        let urlList = [];
        /**  jquery의 .each 는 비동기 처리를 함. 
        // each 문을 벗어나지 못하는 현상이 있어서 for - in 구문을 사용함
        // $postLists.each(async function (i, elem) {    
        //     let newPostUrl = elem.attribs.href;
        //     const postExist = await CrawlUrlPost.exists({ postUrl : newPostUrl });
        //     if (!postExist) {
        //         urlList[i] = newPostUrl;
        //     }
            });
        */
        for (let elem in $postLists){
            if(!$postLists[elem].attribs){
                break;
            }
            let newPostUrl = $postLists[elem].attribs.href;
            const postExist = await CrawlUrlPost.exists({ postUrl : newPostUrl });
            if (!postExist) {
                urlList.push(newPostUrl);
            }
        }
        
        let list = [];
        for (let i = 0; i < urlList.length; i++) {
            console.log("이게 먼저 나오니..?")
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

            list[i] = new CrawlUrlPost({
                createTime: timestamp(),
                uploadTime,
                img: elements.find("img.thumb_g_article").attr("src"),
                postUrl: urlList[i],
                url : accountUrl.url,
                title: elements.find(".tit_view").text().replace("\n", ""),
            });
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