
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const PostData = require("../models/Naver_post");

// 출처: https://hbesthee.tistory.com/1737 [채윤이네집:티스토리]

async function crawler_naverPost() {
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
  // 브라우저를 실행한다.
  // 옵션으로 headless모드를 끌 수 있다.
  const browser = await puppeteer.launch({
    headless: false
  });
  try {
    // 새로운 페이지를 연다.
    const page = await browser.newPage();
    // 페이지의 크기를 설정한다.
    await page.setViewport({
      width: 1366,
      height: 768
    });
    // "https://www.goodchoice.kr/product/search/2" URL에 접속한다. (여기어때 호텔 페이지)
    await page.goto("https://v.daum.net/v/126RBzVs6j");
    console.log("waiting for loading");
    await delay(1000);
    console.log("loading end");
    // 페이지의 HTML을 가져온다.
    const content = await page.content();
    const $ = cheerio.load(content);
    const raw_views = $('span.txt_info:nth-child(1)').text();
    const views = String(Number(raw_views.split(' ')[1].replace('만', '')) * 10000);
    const recommend = $('[data-action-type="RECOMMEND"] span.🎬_count_label').text();
    const like = $('[data-action-type="LIKE"] span.🎬_count_label').text();
    const impress = $('[data-action-type="IMPRESS"] span.🎬_count_label').text();

    // const comments = $('span.u_cbox_count').text();

    console.log(views);
    console.log(recommend);
    console.log(like);
    console.log(impress);

    // const lists = $("#lst_feed > #inner_feed_box");
    return console.log("crawling finished!");
  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }
}

crawler_naverPost();